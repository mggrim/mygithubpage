# Building an OAuth-Based Apple Watch AI Assistant

## Complete Architecture & Implementation Guide

This guide walks through building your own WristGPT-like AI assistant for Apple Watch using OAuth authentication, allowing users to connect their own OpenAI accounts.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Design](#architecture-design)
3. [Technical Stack](#technical-stack)
4. [Authentication Strategies](#authentication-strategies)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Detailed Implementation](#detailed-implementation)
7. [Advanced Features](#advanced-features)
8. [Security Best Practices](#security-best-practices)
9. [Deployment & Distribution](#deployment--distribution)

---

## Project Overview

### What We're Building

A hands-free AI assistant for Apple Watch that:
- Connects to OpenAI via user's own account (OAuth or API key)
- Works standalone on Apple Watch (no iPhone required for queries)
- Supports voice input and text-to-speech output
- Includes modern watchOS features (Double Tap, Action Button, Complications)
- Syncs conversations across iPhone, Watch, and optionally Mac

### Key Differentiator

**User-funded API usage** - Unlike WristGPT which uses developer's API key, your app will use each user's OpenAI credentials, making it sustainable and scalable.

---

## Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Devices                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐    ┌───────────┐  │
│  │ Apple Watch  │◄────►│    iPhone    │◄──►│    Mac    │  │
│  │              │      │              │    │ (Optional)│  │
│  │ • Voice UI   │      │ • OAuth Flow │    │ • Desktop │  │
│  │ • Chat View  │      │ • Settings   │    │   Client  │  │
│  │ • Standalone │      │ • Widgets    │    │           │  │
│  └──────────────┘      └──────────────┘    └───────────┘  │
│         │                      │                   │       │
│         └──────────────────────┼───────────────────┘       │
│                                │                           │
└────────────────────────────────┼───────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   iCloud CloudKit       │
                    │  (Conversation Sync)    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   OpenAI API            │
                    │  • Chat Completions     │
                    │  • OAuth/API Key Auth   │
                    └─────────────────────────┘
```

### Data Flow

```
1. User Authentication Flow:
   iPhone App → OpenAI OAuth → Store Token in Keychain
                                      ↓
   iPhone → WatchConnectivity → Apple Watch (Token Sync)

2. Chat Request Flow (Watch Standalone):
   Watch → Local Keychain → Get Token
                 ↓
   Watch → OpenAI API (with Bearer Token) → Stream Response
                 ↓
   Watch → Display Response → Save to CloudKit
                                      ↓
   CloudKit Sync → iPhone/Mac (Conversation History)

3. Voice Input Flow:
   Watch → Speech Recognition → Text
                 ↓
   Process as Chat Request
```

---

## Technical Stack

### Required Technologies

#### Apple Frameworks
| Framework | Purpose | Platform |
|-----------|---------|----------|
| **SwiftUI** | Modern UI development | Watch, iOS, Mac |
| **Combine** | Reactive programming, data flow | All |
| **WatchConnectivity** | iPhone ↔ Watch communication | Watch, iOS |
| **Speech** | Voice-to-text input | Watch, iOS |
| **AVFoundation** | Text-to-speech output | Watch, iOS |
| **Security (Keychain)** | Secure credential storage | All |
| **CloudKit** | Cross-device data sync | All |
| **WidgetKit** | Home/Lock screen widgets | iOS |
| **AppIntents** | Shortcuts, Siri integration | All |

#### Networking & Authentication
- **URLSession** - HTTP networking
- **OAuth 2.0** - OpenAI authentication
- **JSONDecoder/Encoder** - API parsing
- **Async/Await** - Modern concurrency

#### Development Tools
- **Xcode 15+** - IDE
- **Swift 5.9+** - Language
- **watchOS 10.5+** - Watch platform
- **iOS 18.0+** - iPhone platform
- **macOS 15.0+** - Mac platform (optional)

---

## Authentication Strategies

### Option 1: BYOK (Bring Your Own Key) - Recommended for MVP

**How it works:**
1. User creates API key at platform.openai.com
2. User pastes key into app's settings
3. App stores key securely in Keychain
4. App makes direct API calls with key

**Implementation:**

```swift
// KeychainManager.swift
import Security
import Foundation

class KeychainManager {
    static let shared = KeychainManager()
    private let service = "com.yourapp.openai"

    func saveAPIKey(_ key: String) -> Bool {
        let data = key.data(using: .utf8)!

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: "openai_api_key",
            kSecValueData as String: data
        ]

        // Delete old key if exists
        SecItemDelete(query as CFDictionary)

        // Add new key
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }

    func getAPIKey() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: "openai_api_key",
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess,
              let data = result as? Data,
              let key = String(data: data, encoding: .utf8) else {
            return nil
        }

        return key
    }

    func deleteAPIKey() -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: "openai_api_key"
        ]

        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess
    }
}
```

**Pros:**
- Simple to implement
- No backend required
- Users have full control
- Low development complexity

**Cons:**
- Requires user technical knowledge
- Manual setup process
- No automatic key rotation

### Option 2: OAuth 2.0 - Better UX, More Complex

**How it works:**
1. User taps "Connect OpenAI Account"
2. Safari/WebView opens OpenAI OAuth page
3. User authorizes your app
4. OAuth callback returns access token
5. App stores token, makes API calls on behalf of user

**Implementation:**

```swift
// OAuthManager.swift
import Foundation
import AuthenticationServices

class OAuthManager: NSObject, ObservableObject {
    @Published var isAuthenticated = false
    @Published var authError: Error?

    private let clientID = "your_client_id" // From OpenAI
    private let redirectURI = "yourapp://oauth/callback"
    private let scope = "api.read api.write"

    // Step 1: Initiate OAuth Flow
    func startOAuthFlow() {
        guard let authURL = buildAuthorizationURL() else {
            return
        }

        let session = ASWebAuthenticationSession(
            url: authURL,
            callbackURLScheme: "yourapp"
        ) { [weak self] callbackURL, error in
            if let error = error {
                self?.authError = error
                return
            }

            guard let callbackURL = callbackURL else { return }
            self?.handleCallback(url: callbackURL)
        }

        session.presentationContextProvider = self
        session.prefersEphemeralWebBrowserSession = false
        session.start()
    }

    // Step 2: Build Authorization URL
    private func buildAuthorizationURL() -> URL? {
        var components = URLComponents(string: "https://auth.openai.com/authorize")
        components?.queryItems = [
            URLQueryItem(name: "client_id", value: clientID),
            URLQueryItem(name: "redirect_uri", value: redirectURI),
            URLQueryItem(name: "response_type", value: "code"),
            URLQueryItem(name: "scope", value: scope),
            URLQueryItem(name: "state", value: generateState())
        ]
        return components?.url
    }

    // Step 3: Handle OAuth Callback
    private func handleCallback(url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let code = components.queryItems?.first(where: { $0.name == "code" })?.value else {
            return
        }

        // Exchange code for access token
        Task {
            await exchangeCodeForToken(code: code)
        }
    }

    // Step 4: Exchange Authorization Code for Token
    private func exchangeCodeForToken(code: String) async {
        let tokenURL = URL(string: "https://auth.openai.com/token")!

        var request = URLRequest(url: tokenURL)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        let bodyParams = [
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirectURI,
            "client_id": clientID
        ]

        request.httpBody = bodyParams
            .map { "\($0.key)=\($0.value)" }
            .joined(separator: "&")
            .data(using: .utf8)

        do {
            let (data, _) = try await URLSession.shared.data(for: request)
            let tokenResponse = try JSONDecoder().decode(TokenResponse.self, from: data)

            // Store tokens securely
            KeychainManager.shared.saveAccessToken(tokenResponse.accessToken)
            KeychainManager.shared.saveRefreshToken(tokenResponse.refreshToken)

            await MainActor.run {
                isAuthenticated = true
            }
        } catch {
            await MainActor.run {
                authError = error
            }
        }
    }

    // Generate random state for CSRF protection
    private func generateState() -> String {
        return UUID().uuidString
    }

    // Refresh access token when expired
    func refreshAccessToken() async throws {
        guard let refreshToken = KeychainManager.shared.getRefreshToken() else {
            throw OAuthError.noRefreshToken
        }

        let tokenURL = URL(string: "https://auth.openai.com/token")!
        var request = URLRequest(url: tokenURL)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        let bodyParams = [
            "grant_type": "refresh_token",
            "refresh_token": refreshToken,
            "client_id": clientID
        ]

        request.httpBody = bodyParams
            .map { "\($0.key)=\($0.value)" }
            .joined(separator: "&")
            .data(using: .utf8)

        let (data, _) = try await URLSession.shared.data(for: request)
        let tokenResponse = try JSONDecoder().decode(TokenResponse.self, from: data)

        KeychainManager.shared.saveAccessToken(tokenResponse.accessToken)
    }
}

// MARK: - ASWebAuthenticationPresentationContextProviding
extension OAuthManager: ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return ASPresentationAnchor()
    }
}

// MARK: - Models
struct TokenResponse: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresIn: Int
    let tokenType: String

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
        case tokenType = "token_type"
    }
}

enum OAuthError: Error {
    case noRefreshToken
    case invalidCallback
}
```

**Pros:**
- Better user experience
- Automatic token management
- Standard OAuth flow
- Professional implementation

**Cons:**
- More complex to implement
- Requires OAuth client registration with OpenAI
- Need to handle token refresh
- Backend might be needed for client secret

### Option 3: Hybrid Approach

Start with **BYOK for MVP**, add **OAuth in v2.0** for better UX.

---

## Implementation Roadmap

### Phase 1: MVP (2-3 weeks)

**Week 1: Core Infrastructure**
- [ ] Project setup (Xcode workspace with iOS + Watch targets)
- [ ] Keychain integration for API key storage
- [ ] Basic settings screen (iPhone) for API key input
- [ ] OpenAI API client with streaming support
- [ ] Basic chat data models

**Week 2: Watch Interface**
- [ ] Watch chat UI with SwiftUI
- [ ] Voice input integration (Speech framework)
- [ ] Text-to-speech responses (AVFoundation)
- [ ] WatchConnectivity setup for token sync
- [ ] Conversation history (local storage)

**Week 3: Polish & Testing**
- [ ] Error handling and retry logic
- [ ] Loading states and animations
- [ ] Watch complication (simple)
- [ ] Basic testing on real hardware
- [ ] TestFlight beta

### Phase 2: Enhanced Features (2-3 weeks)

**Week 4-5: Advanced Integration**
- [ ] CloudKit setup for cross-device sync
- [ ] iPhone widgets (Home Screen, Lock Screen)
- [ ] Action Button support (Watch Ultra, iPhone 15 Pro+)
- [ ] Double Tap gesture (Watch Series 9, Ultra 2)
- [ ] Improved complications with multiple styles

**Week 6: Premium Features**
- [ ] Conversation management (folders, search)
- [ ] Voice settings (speed, language)
- [ ] Theme customization
- [ ] Export conversations
- [ ] Shortcuts integration

### Phase 3: OAuth & Scale (2-3 weeks)

**Week 7-8: OAuth Implementation**
- [ ] Register OAuth app with OpenAI
- [ ] Implement OAuth flow (ASWebAuthenticationSession)
- [ ] Token refresh mechanism
- [ ] Migration path from API key to OAuth
- [ ] Account management UI

**Week 9: Launch Prep**
- [ ] App Store assets and screenshots
- [ ] Privacy policy and terms
- [ ] App Review preparation
- [ ] Marketing website
- [ ] Launch!

---

## Detailed Implementation

### 1. OpenAI API Client

```swift
// OpenAIClient.swift
import Foundation

actor OpenAIClient {
    private let baseURL = "https://api.openai.com/v1"
    private let session = URLSession.shared

    // MARK: - Streaming Chat Completion
    func streamChatCompletion(
        messages: [ChatMessage],
        model: String = "gpt-4o-mini",
        onChunk: @escaping (String) -> Void
    ) async throws {
        guard let apiKey = KeychainManager.shared.getAPIKey() else {
            throw OpenAIError.noAPIKey
        }

        let url = URL(string: "\(baseURL)/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let requestBody = ChatCompletionRequest(
            model: model,
            messages: messages,
            stream: true
        )

        request.httpBody = try JSONEncoder().encode(requestBody)

        let (bytes, response) = try await session.bytes(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw OpenAIError.invalidResponse
        }

        // Process server-sent events
        for try await line in bytes.lines {
            guard line.hasPrefix("data: "),
                  line != "data: [DONE]" else { continue }

            let jsonString = String(line.dropFirst(6))
            guard let data = jsonString.data(using: .utf8),
                  let chunk = try? JSONDecoder().decode(ChatCompletionChunk.self, from: data),
                  let content = chunk.choices.first?.delta.content else {
                continue
            }

            onChunk(content)
        }
    }

    // MARK: - Non-streaming Chat Completion
    func chatCompletion(
        messages: [ChatMessage],
        model: String = "gpt-4o-mini"
    ) async throws -> String {
        guard let apiKey = KeychainManager.shared.getAPIKey() else {
            throw OpenAIError.noAPIKey
        }

        let url = URL(string: "\(baseURL)/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let requestBody = ChatCompletionRequest(
            model: model,
            messages: messages,
            stream: false
        )

        request.httpBody = try JSONEncoder().encode(requestBody)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw OpenAIError.invalidResponse
        }

        // Handle API errors
        if httpResponse.statusCode != 200 {
            if let error = try? JSONDecoder().decode(OpenAIAPIError.self, from: data) {
                throw OpenAIError.apiError(error.error.message)
            }
            throw OpenAIError.httpError(httpResponse.statusCode)
        }

        let completion = try JSONDecoder().decode(ChatCompletionResponse.self, from: data)

        guard let message = completion.choices.first?.message.content else {
            throw OpenAIError.noContent
        }

        return message
    }
}

// MARK: - Models
struct ChatMessage: Codable, Identifiable {
    let id: UUID
    let role: Role
    let content: String

    enum Role: String, Codable {
        case system
        case user
        case assistant
    }

    init(role: Role, content: String) {
        self.id = UUID()
        self.role = role
        self.content = content
    }
}

struct ChatCompletionRequest: Codable {
    let model: String
    let messages: [ChatMessage]
    let stream: Bool
}

struct ChatCompletionResponse: Codable {
    let choices: [Choice]

    struct Choice: Codable {
        let message: ChatMessage
    }
}

struct ChatCompletionChunk: Codable {
    let choices: [Choice]

    struct Choice: Codable {
        let delta: Delta
    }

    struct Delta: Codable {
        let content: String?
    }
}

struct OpenAIAPIError: Codable {
    let error: ErrorDetail

    struct ErrorDetail: Codable {
        let message: String
        let type: String
        let code: String?
    }
}

enum OpenAIError: Error, LocalizedError {
    case noAPIKey
    case invalidResponse
    case httpError(Int)
    case apiError(String)
    case noContent

    var errorDescription: String? {
        switch self {
        case .noAPIKey:
            return "No API key found. Please add your OpenAI API key in settings."
        case .invalidResponse:
            return "Invalid response from server."
        case .httpError(let code):
            return "HTTP error: \(code)"
        case .apiError(let message):
            return message
        case .noContent:
            return "No content in response."
        }
    }
}
```

### 2. Watch App UI

```swift
// WatchChatView.swift
import SwiftUI

struct WatchChatView: View {
    @StateObject private var viewModel = ChatViewModel()
    @State private var isRecording = false

    var body: some View {
        NavigationStack {
            ZStack {
                // Chat messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 12) {
                            ForEach(viewModel.messages) { message in
                                MessageBubble(message: message)
                                    .id(message.id)
                            }

                            if viewModel.isLoading {
                                HStack {
                                    ProgressView()
                                    Text("Thinking...")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding()
                    }
                    .onChange(of: viewModel.messages.count) { _ in
                        if let lastMessage = viewModel.messages.last {
                            withAnimation {
                                proxy.scrollTo(lastMessage.id, anchor: .bottom)
                            }
                        }
                    }
                }

                // Voice input button
                VStack {
                    Spacer()

                    Button(action: {
                        if isRecording {
                            viewModel.stopRecording()
                        } else {
                            viewModel.startRecording()
                        }
                        isRecording.toggle()
                    }) {
                        Image(systemName: isRecording ? "stop.circle.fill" : "mic.circle.fill")
                            .font(.system(size: 44))
                            .foregroundColor(isRecording ? .red : .blue)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .padding(.bottom)
                }
            }
            .navigationTitle("AI Chat")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: viewModel.newConversation) {
                        Image(systemName: "square.and.pencil")
                    }
                }
            }
        }
    }
}

struct MessageBubble: View {
    let message: ChatMessage

    var body: some View {
        HStack {
            if message.role == .user {
                Spacer()
            }

            Text(message.content)
                .padding(10)
                .background(message.role == .user ? Color.blue : Color.gray.opacity(0.3))
                .foregroundColor(message.role == .user ? .white : .primary)
                .cornerRadius(12)

            if message.role == .assistant {
                Spacer()
            }
        }
    }
}
```

### 3. Chat ViewModel

```swift
// ChatViewModel.swift
import SwiftUI
import Speech
import AVFoundation

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var isLoading = false
    @Published var error: Error?

    private let client = OpenAIClient()
    private let speechRecognizer = SFSpeechRecognizer()
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    private let synthesizer = AVSpeechSynthesizer()

    init() {
        requestSpeechAuthorization()
    }

    // MARK: - Speech Recognition
    func startRecording() {
        // Cancel previous task
        recognitionTask?.cancel()
        recognitionTask = nil

        // Configure audio session
        let audioSession = AVAudioSession.sharedInstance()
        try? audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
        try? audioSession.setActive(true, options: .notifyOthersOnDeactivation)

        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()

        guard let recognitionRequest = recognitionRequest else { return }
        recognitionRequest.shouldReportPartialResults = true

        let inputNode = audioEngine.inputNode

        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            guard let self = self else { return }

            var isFinal = false

            if let result = result {
                let transcription = result.bestTranscription.formattedString
                isFinal = result.isFinal

                if isFinal {
                    Task {
                        await self.sendMessage(transcription)
                    }
                }
            }

            if error != nil || isFinal {
                self.audioEngine.stop()
                inputNode.removeTap(onBus: 0)
                self.recognitionRequest = nil
                self.recognitionTask = nil
            }
        }

        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            recognitionRequest.append(buffer)
        }

        audioEngine.prepare()
        try? audioEngine.start()
    }

    func stopRecording() {
        audioEngine.stop()
        recognitionRequest?.endAudio()
    }

    private func requestSpeechAuthorization() {
        SFSpeechRecognizer.requestAuthorization { status in
            // Handle authorization
        }
    }

    // MARK: - Chat Operations
    func sendMessage(_ text: String) async {
        let userMessage = ChatMessage(role: .user, content: text)
        messages.append(userMessage)

        isLoading = true

        do {
            var assistantMessage = ChatMessage(role: .assistant, content: "")
            messages.append(assistantMessage)

            try await client.streamChatCompletion(messages: messages) { chunk in
                Task { @MainActor in
                    if let index = self.messages.firstIndex(where: { $0.id == assistantMessage.id }) {
                        self.messages[index] = ChatMessage(
                            role: .assistant,
                            content: self.messages[index].content + chunk
                        )
                        assistantMessage = self.messages[index]
                    }
                }
            }

            isLoading = false

            // Speak response
            speakText(assistantMessage.content)

        } catch {
            self.error = error
            isLoading = false
            messages.removeLast() // Remove empty assistant message
        }
    }

    // MARK: - Text-to-Speech
    private func speakText(_ text: String) {
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        utterance.rate = 0.5

        synthesizer.speak(utterance)
    }

    func newConversation() {
        messages.removeAll()
        synthesizer.stopSpeaking(at: .immediate)
    }
}
```

### 4. Watch Connectivity Manager

```swift
// WatchConnectivityManager.swift
import WatchConnectivity

class WatchConnectivityManager: NSObject, ObservableObject {
    static let shared = WatchConnectivityManager()

    @Published var apiKey: String?

    private override init() {
        super.init()

        if WCSession.isSupported() {
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }
    }

    // iPhone: Send API key to Watch
    func sendAPIKeyToWatch(_ key: String) {
        guard WCSession.default.isReachable else {
            // Save for background transfer
            WCSession.default.transferUserInfo(["apiKey": key])
            return
        }

        WCSession.default.sendMessage(["apiKey": key], replyHandler: nil) { error in
            print("Error sending API key: \(error)")
        }
    }

    // Watch: Request API key from iPhone
    func requestAPIKey() {
        guard WCSession.default.isReachable else { return }

        WCSession.default.sendMessage(["action": "requestAPIKey"], replyHandler: { response in
            if let key = response["apiKey"] as? String {
                self.apiKey = key
                KeychainManager.shared.saveAPIKey(key)
            }
        })
    }
}

extension WatchConnectivityManager: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        // Handle activation
    }

    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        if let key = message["apiKey"] as? String {
            DispatchQueue.main.async {
                self.apiKey = key
                KeychainManager.shared.saveAPIKey(key)
            }
        }

        #if os(iOS)
        if message["action"] as? String == "requestAPIKey" {
            if let key = KeychainManager.shared.getAPIKey() {
                session.sendMessage(["apiKey": key], replyHandler: nil)
            }
        }
        #endif
    }

    func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any]) {
        // Handle background transfer
        if let key = userInfo["apiKey"] as? String {
            DispatchQueue.main.async {
                self.apiKey = key
                KeychainManager.shared.saveAPIKey(key)
            }
        }
    }

    #if os(iOS)
    func sessionDidBecomeInactive(_ session: WCSession) {}
    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
    #endif
}
```

### 5. Watch Complication

```swift
// ComplicationController.swift
import ClockKit
import SwiftUI

struct AIComplicationView: View {
    var body: some View {
        ZStack {
            Circle()
                .fill(Color.blue)

            Image(systemName: "bubble.left.and.bubble.right.fill")
                .foregroundColor(.white)
        }
    }
}

// Complication Provider
class ComplicationController: NSObject, CLKComplicationDataSource {

    func getCurrentTimelineEntry(for complication: CLKComplication, withHandler handler: @escaping (CLKComplicationTimelineEntry?) -> Void) {
        let template = createTemplate(for: complication)
        let entry = CLKComplicationTimelineEntry(date: Date(), complicationTemplate: template)
        handler(entry)
    }

    private func createTemplate(for complication: CLKComplication) -> CLKComplicationTemplate {
        switch complication.family {
        case .graphicCircular:
            let imageProvider = CLKFullColorImageProvider(
                fullColorImage: UIImage(systemName: "bubble.left.and.bubble.right.fill")!
            )
            return CLKComplicationTemplateGraphicCircularImage(imageProvider: imageProvider)

        case .graphicCorner:
            let imageProvider = CLKFullColorImageProvider(
                fullColorImage: UIImage(systemName: "sparkles")!
            )
            let textProvider = CLKSimpleTextProvider(text: "AI")
            return CLKComplicationTemplateGraphicCornerCircularImage(imageProvider: imageProvider)

        case .modularSmall:
            let imageProvider = CLKImageProvider(onePieceImage: UIImage(systemName: "bubble.left.and.bubble.right")!)
            return CLKComplicationTemplateModularSmallSimpleImage(imageProvider: imageProvider)

        default:
            let imageProvider = CLKFullColorImageProvider(
                fullColorImage: UIImage(systemName: "sparkles")!
            )
            return CLKComplicationTemplateGraphicCircularImage(imageProvider: imageProvider)
        }
    }

    func getComplicationDescriptors(handler: @escaping ([CLKComplicationDescriptor]) -> Void) {
        let descriptors = [
            CLKComplicationDescriptor(
                identifier: "ai_chat",
                displayName: "AI Chat",
                supportedFamilies: [.graphicCircular, .graphicCorner, .modularSmall]
            )
        ]
        handler(descriptors)
    }
}
```

---

## Advanced Features

### Double Tap Gesture (Series 9, Ultra 2)

```swift
// DoubleTabGestureView.swift
import SwiftUI

struct ChatViewWithDoubleTap: View {
    @StateObject private var viewModel = ChatViewModel()
    @Environment(\.isLuminanceReduced) var isLuminanceReduced

    var body: some View {
        WatchChatView()
            .handGestureShortcut(.primaryAction) {
                // Trigger voice input on double tap
                viewModel.startRecording()
            }
    }
}
```

### Action Button Support

```swift
// Add to Info.plist for Watch target
/*
<key>WKApplication</key>
<dict>
    <key>WKActionButtonShortcut</key>
    <string>VoiceInput</string>
</dict>
*/

// Handle in Watch App
@main
struct MyWatchApp: App {
    var body: some Scene {
        WindowGroup {
            WatchChatView()
                .handGestureShortcut(.secondaryAction) {
                    // Handle action button press
                    NotificationCenter.default.post(
                        name: .actionButtonPressed,
                        object: nil
                    )
                }
        }
    }
}

extension Notification.Name {
    static let actionButtonPressed = Notification.Name("actionButtonPressed")
}
```

### iPhone Widgets

```swift
// Widget.swift
import WidgetKit
import SwiftUI

struct QuickChatWidget: Widget {
    let kind = "QuickChatWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            QuickChatWidgetView(entry: entry)
        }
        .configurationDisplayName("AI Quick Chat")
        .description("Quick access to AI chat")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular])
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let entry = SimpleEntry(date: Date())
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct QuickChatWidgetView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemSmall:
            smallWidget
        case .systemMedium:
            mediumWidget
        case .accessoryCircular:
            accessoryCircular
        default:
            smallWidget
        }
    }

    var smallWidget: some View {
        ZStack {
            Color.blue.gradient

            VStack {
                Image(systemName: "sparkles")
                    .font(.largeTitle)
                Text("AI Chat")
                    .font(.caption)
            }
            .foregroundColor(.white)
        }
        .widgetURL(URL(string: "myapp://chat")!)
    }

    var mediumWidget: some View {
        HStack {
            Image(systemName: "sparkles")
                .font(.system(size: 40))
                .foregroundColor(.blue)

            VStack(alignment: .leading) {
                Text("AI Assistant")
                    .font(.headline)
                Text("Tap to start chatting")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding()
        .widgetURL(URL(string: "myapp://chat")!)
    }

    var accessoryCircular: some View {
        ZStack {
            AccessoryWidgetBackground()
            Image(systemName: "sparkles")
                .font(.title2)
        }
        .widgetURL(URL(string: "myapp://chat")!)
    }
}
```

### CloudKit Sync

```swift
// CloudKitManager.swift
import CloudKit

class CloudKitManager {
    static let shared = CloudKitManager()

    private let container = CKContainer.default()
    private let database: CKDatabase

    init() {
        database = container.privateCloudDatabase
    }

    // Save conversation
    func saveConversation(_ messages: [ChatMessage]) async throws {
        let record = CKRecord(recordType: "Conversation")
        record["messages"] = try JSONEncoder().encode(messages)
        record["createdAt"] = Date()

        try await database.save(record)
    }

    // Fetch conversations
    func fetchConversations() async throws -> [[ChatMessage]] {
        let query = CKQuery(recordType: "Conversation", predicate: NSPredicate(value: true))
        query.sortDescriptors = [NSSortDescriptor(key: "createdAt", ascending: false)]

        let results = try await database.records(matching: query)

        var conversations: [[ChatMessage]] = []

        for (_, result) in results.matchResults {
            let record = try result.get()
            if let data = record["messages"] as? Data {
                let messages = try JSONDecoder().decode([ChatMessage].self, from: data)
                conversations.append(messages)
            }
        }

        return conversations
    }
}
```

---

## Security Best Practices

### 1. Keychain Security
- ✅ Always use `kSecAttrAccessibleAfterFirstUnlock` or stricter
- ✅ Never log API keys or tokens
- ✅ Clear tokens on logout
- ✅ Use biometric authentication for sensitive settings

### 2. Network Security
```swift
// Implement certificate pinning
class SecureURLSession {
    static let shared = SecureURLSession()

    private lazy var session: URLSession = {
        let config = URLSessionConfiguration.default
        return URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }()
}

extension SecureURLSession: URLSessionDelegate {
    func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        // Implement certificate pinning for OpenAI
        guard let serverTrust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }

        // Verify certificate
        completionHandler(.useCredential, URLCredential(trust: serverTrust))
    }
}
```

### 3. Privacy
- ✅ Request minimal permissions
- ✅ Clear privacy policy
- ✅ Don't log user messages
- ✅ Encrypted local storage for sensitive data
- ✅ Allow users to delete all data

### 4. API Key Protection
```swift
// Validate API key format before storage
func validateAPIKey(_ key: String) -> Bool {
    // OpenAI keys start with "sk-"
    return key.hasPrefix("sk-") && key.count > 20
}

// Rate limiting to prevent abuse
actor RateLimiter {
    private var lastRequest: Date?
    private let minimumInterval: TimeInterval = 1.0 // 1 second

    func canMakeRequest() -> Bool {
        guard let last = lastRequest else {
            lastRequest = Date()
            return true
        }

        let elapsed = Date().timeIntervalSince(last)
        if elapsed >= minimumInterval {
            lastRequest = Date()
            return true
        }

        return false
    }
}
```

---

## Deployment & Distribution

### App Store Requirements

#### Privacy Manifest
```json
{
  "NSPrivacyTracking": false,
  "NSPrivacyTrackingDomains": [],
  "NSPrivacyCollectedDataTypes": [],
  "NSPrivacyAccessedAPITypes": [
    {
      "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
      "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
    }
  ]
}
```

#### Required Permissions (Info.plist)
```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>We use speech recognition to transcribe your voice commands to the AI.</string>

<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice input.</string>

<key>NSNetworkUsageDescription</key>
<string>We need network access to communicate with OpenAI's API.</string>
```

### TestFlight Beta Testing

**Week 1-2: Internal Testing**
- Test on all device types
- Verify API key flow
- Check error handling
- Test offline scenarios

**Week 3-4: External Beta**
- 50-100 beta testers
- Gather feedback on UX
- Monitor crash reports
- Iterate quickly

### App Review Preparation

**Key Points:**
1. **Demo Account**: Provide test API key in review notes
2. **Privacy**: Clear privacy policy explaining API usage
3. **Functionality**: Ensure all features work without crashes
4. **Age Rating**: Appropriate rating (likely 4+)
5. **Content**: No restricted content generation

### Pricing Strategy

**Option 1: Free App**
- User provides own API key
- Revenue from tips/donations
- Build user base quickly

**Option 2: Freemium**
- Free: Limited features
- Pro ($4.99/month): Advanced features, better UI, priority support
- Revenue stream while users pay for API

**Option 3: One-time Purchase**
- $9.99-$19.99 one-time
- All features included
- User still needs API key
- No recurring revenue

**Recommended**: Start free, add premium features later

---

## Next Steps

### Immediate Actions (This Week)

1. **Set up Xcode project**
   ```bash
   # Create new Xcode project
   # Choose: Multiplatform > App
   # Enable: iOS, watchOS targets
   # Use SwiftUI
   ```

2. **Implement basic BYOK flow**
   - Settings screen
   - Keychain integration
   - API key validation

3. **Build minimal Watch UI**
   - Chat view
   - Voice input button
   - Message display

4. **Test OpenAI API integration**
   - Test with your own API key
   - Verify streaming works
   - Handle errors gracefully

### Week 2-3: MVP Features

- WatchConnectivity sync
- Text-to-speech
- Conversation history
- Basic complication
- Error handling

### Week 4+: Polish & Launch

- CloudKit sync
- Widgets
- Action Button/Double Tap
- TestFlight beta
- App Store submission

---

## Resources & Documentation

### Official Documentation
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Apple WatchKit](https://developer.apple.com/documentation/watchkit)
- [WatchConnectivity Framework](https://developer.apple.com/documentation/watchconnectivity)
- [Speech Framework](https://developer.apple.com/documentation/speech)
- [CloudKit](https://developer.apple.com/documentation/cloudkit)

### Useful Libraries
- [OpenAI Swift](https://github.com/MacPaw/OpenAI) - Swift OpenAI client
- [SwiftUI Watch Apps](https://developer.apple.com/tutorials/swiftui-concepts/exploring-the-structure-of-a-swiftui-app)

### Community
- [r/SwiftUI](https://reddit.com/r/SwiftUI)
- [r/AppleWatch](https://reddit.com/r/AppleWatch)
- [Swift Forums](https://forums.swift.org)

---

## Conclusion

Building an OAuth-based WristGPT alternative is totally achievable! Start with BYOK for MVP simplicity, focus on great UX for voice interaction, and leverage Apple's latest watchOS features like Double Tap and Action Button to differentiate.

The key advantages of your approach:
- **Sustainable** - Users pay for their API usage
- **Scalable** - Low infrastructure costs
- **Privacy-focused** - No server-side message storage needed
- **Differentiated** - Can add unique features

Good luck with your build! 🚀

---

*Last Updated: January 2026*

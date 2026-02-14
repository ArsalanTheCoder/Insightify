package com.insightify

import java.util.Locale
import java.util.regex.Pattern

object ScamFilter {

    // URL detection patterns
    private val LINK_PATTERN: Pattern = Pattern.compile(
        "(https?://\\S+|www\\.\\S+|\\S+\\.(com|org|net|io|xyz|top|link|click|info|biz|co|me|ly|tk|ml|ga|cf|gq|bit|money|win|prize|cash|free)\\b)",
        Pattern.CASE_INSENSITIVE
    )

    // Shortened URLs are almost always suspicious
    private val SHORT_URL_PATTERN: Pattern = Pattern.compile(
        "(bit\\.ly|tinyurl\\.com|t\\.co|goo\\.gl|is\\.gd|rb\\.gy|shorturl\\.at|cutt\\.ly|ow\\.ly|tiny\\.cc|v\\.gd|clck\\.ru|shrtco\\.de)",
        Pattern.CASE_INSENSITIVE
    )

    // Domain impersonation patterns (e.g., paypa1.com, amaz0n.com)
    private val IMPERSONATION_PATTERN: Pattern = Pattern.compile(
        "(paypa[l1i]|amaz[o0]n|app[l1]e|g[o0]{2}g[l1]e|micr[o0]s[o0]ft|netf[l1i]x|faceb[o0]{2}k|insta[g9]ram|wh[a@]ts[a@]pp|y[o0]utub[e3]|tw[i1]tt[e3]r|snap[c€]hat)\\.[a-z]{2,}",
        Pattern.CASE_INSENSITIVE
    )

    // Money / currency patterns ($100, USD, Rs, free money, etc.)
    private val MONEY_PATTERN: Pattern = Pattern.compile(
        "(\\$\\d+|\\d+\\s?(usd|eur|gbp|pkr|inr|rs|rupees|dollars|pounds|bitcoin|btc|eth|usdt)|free\\s+money|prize\\s+money|cash\\s+prize|reward|bonus|cashback|refund|lottery|jackpot)",
        Pattern.CASE_INSENSITIVE
    )

    // Phone number / contact request pattern
    private val CONTACT_REQUEST_PATTERN: Pattern = Pattern.compile(
        "(call\\s+(me|us|this)|whatsapp\\s+(me|us|this)|text\\s+(me|us|this)|contact\\s+(me|us)|reach\\s+(me|us)|dm\\s+me|message\\s+me)",
        Pattern.CASE_INSENSITIVE
    )

    // Urgency / action-forcing words
    private val urgencyWords = listOf(
        "urgent", "immediately", "asap", "right now",
        "last chance", "limited time", "act now", "act fast",
        "verify now", "verify immediately",
        "suspend", "suspended", "blocked", "locked",
        "expire", "expired", "expires today", "expiring",
        "within 24 hours", "within 48 hours", "within 12 hours",
        "action required", "immediate action",
        "your account will be", "failure to",
        "hurry", "don't miss", "only today",
        "limited offer", "exclusive offer",
        "before it's too late", "running out",
        "final warning", "last warning", "final notice",
        "respond now", "reply immediately",
        "time sensitive", "don't delay",
        "now or never", "today only"
    )

    // Sensitive financial/personal data words
    private val sensitiveWords = listOf(
        "bank", "account", "password", "pin",
        "otp", "one-time", "transaction",
        "card number", "credit card", "debit card",
        "cvv", "expiry", "security code",
        "verification", "ssn", "cnic", "aadhaar",
        "social security", "tax refund", "tax return",
        "payment", "transfer", "wire transfer",
        "bitcoin", "crypto", "wallet", "seed phrase",
        "loan", "deposit", "withdraw", "withdrawal",
        "routing number", "swift code", "iban",
        "personal information", "personal details",
        "identity", "passport", "driver license"
    )

    // Scam trigger phrases (whole phrases — highest quality signals)
    private val scamPhrases = listOf(
        // Click/link bait
        "click here", "click the link", "click below",
        "click on this", "click this", "tap here",
        "tap the link", "open this link", "visit this",
        "follow this link", "go to this", "check this out",
        "see this link", "open the link",

        // Prize / winning scams
        "claim your", "claim now", "claim prize",
        "congratulations", "you have won", "you've won",
        "selected as winner", "lucky winner", "you are selected",
        "won a prize", "won a gift", "won a car", "won a phone",
        "you have been selected", "your number was selected",
        "lucky draw", "you are the winner",
        "spin the wheel", "scratch and win",

        // Money / financial lure
        "get free", "earn free", "win free",
        "free gift", "gift card", "free money",
        "get $", "win $", "earn $", "receive $",
        "investment opportunity", "guaranteed return",
        "double your money", "earn money fast", "easy money",
        "guaranteed profit", "100% return", "high returns",
        "no risk", "risk free", "zero risk",
        "make money", "extra income",

        // Data harvesting
        "send your", "send me", "send otp", "send code",
        "share your", "share otp", "share password", "share code",
        "update your details", "confirm your identity",
        "verify your account", "confirm your account",
        "enter your details", "provide your", "submit your",
        "fill out this form", "complete this form",
        "log in here", "login here", "sign in here",
        "reset your password", "change your password",

        // Threats / fear
        "your account has been", "account will be closed",
        "account will be suspended", "account will be blocked",
        "unauthorized access", "suspicious activity",
        "unusual activity", "security alert",
        "we have detected", "we have noticed",
        "illegal activity", "law enforcement",
        "legal action", "court case", "arrest warrant",
        "you will be arrested", "police", "fbi", "fia",

        // Job / income scams
        "work from home", "make money online",
        "hiring now", "easy income", "quick money",
        "part time job", "earn from home",
        "no experience needed", "no investment required",
        "daily earning", "weekly payout",

        // Delivery / shipping scams
        "your package", "your parcel", "delivery failed",
        "shipping update", "track your order",
        "customs fee", "delivery charge",
        "reschedule delivery", "confirm delivery",

        // Relationship / romance scams
        "i am a lonely", "beautiful woman", "handsome man",
        "looking for a partner", "interested in you",
        "Sugar ", "sugar daddy", "sugar mommy",

        // Generic scam openings
        "dear customer", "dear user", "dear valued",
        "dear sir", "dear madam", "dear friend",
        "attention", "important notice",
        "this is not a spam", "this is legitimate",
        "i am contacting you", "you are being contacted",

        // Crypto / trading scams
        "trading signal", "forex", "binary option",
        "mining pool", "airdrop", "nft drop",
        "pump and dump", "insider tip",

        // Government / authority impersonation
        "from the government", "irs", "hmrc", "fbr",
        "nadra", "tax authority", "revenue service",
        "social welfare", "stimulus check"
    )

    /**
     * Compute a local heuristic score (0-7+) for scam likelihood.
     * Score >= 1 with link: "suspicious, send to backend AI".
     * Score >= 2: "show notification".
     * Score >= 4: "high risk, show prominent alert".
     */
    fun computeLocalScore(title: String, text: String): Int {
        var score = 0
        val combined = "$title $text".lowercase(Locale.getDefault())

        // Check if sender looks like a phone number (unsaved contact)
        if (looksLikePhoneNumber(title)) {
            score += 1
        }

        // URL detection
        val hasLink = LINK_PATTERN.matcher(combined).find()
        if (hasLink) {
            score += 1
        }

        // Shortened URLs are extra suspicious
        if (SHORT_URL_PATTERN.matcher(combined).find()) {
            score += 2
        }

        // Domain impersonation (paypa1.com etc.)
        if (IMPERSONATION_PATTERN.matcher(combined).find()) {
            score += 3  // Very high confidence scam signal
        }

        // Money / currency mentions ($100, free money, etc.)
        if (MONEY_PATTERN.matcher(combined).find()) {
            score += 1
        }

        // Contact request patterns (call me, whatsapp me, etc.)
        if (CONTACT_REQUEST_PATTERN.matcher(combined).find()) {
            score += 1
        }

        // Urgency language
        val urgencyMatches = urgencyWords.count { combined.contains(it) }
        if (urgencyMatches >= 2) {
            score += 2
        } else if (urgencyMatches == 1) {
            score += 1
        }

        // Sensitive data keywords
        val sensitiveMatches = sensitiveWords.count { combined.contains(it) }
        if (sensitiveMatches >= 2) {
            score += 2
        } else if (sensitiveMatches == 1) {
            score += 1
        }

        // Full scam phrases (highest quality signal)
        val phraseMatches = scamPhrases.count { combined.contains(it) }
        if (phraseMatches >= 3) {
            score += 3  // Many scam phrases = definitely scam
        } else if (phraseMatches >= 2) {
            score += 2  // Multiple scam phrases = very likely
        } else if (phraseMatches == 1) {
            score += 1
        }

        // Link + any scam phrase = strong combo signal
        if (hasLink && phraseMatches >= 1) {
            score += 1
        }

        // Link + money mention = strong combo signal
        if (hasLink && MONEY_PATTERN.matcher(combined).find()) {
            score += 1
        }

        // Excessive caps/exclamation (spam signals)
        val capsRatio = text.count { it.isUpperCase() }.toFloat() / text.length.coerceAtLeast(1)
        if (capsRatio > 0.5 && text.length > 10) {
            score += 1
        }
        if (text.count { it == '!' } >= 2) {
            score += 1
        }

        return score
    }

    /**
     * Decision threshold: should this message be sent to the backend AI?
     */
    fun shouldSendToBackend(title: String, text: String): Boolean {
        return computeLocalScore(title, text) >= 2
    }

    /**
     * Check if a string looks like a raw phone number (unsaved contact).
     */
    private fun looksLikePhoneNumber(s: String?): Boolean {
        if (s.isNullOrBlank()) return false

        val t = s.trim()
        val digitCount = t.count { it.isDigit() }

        if (t.startsWith("+") && digitCount >= 6) return true
        if (digitCount >= 7 && digitCount >= t.length / 2) return true

        val cleaned = t.replace("[\\s\\-()]+".toRegex(), "")
        return cleaned.length >= 7 && cleaned.all { it.isDigit() }
    }
}

# Known Issues and Workarounds

## 1) Foxit PDF Services upload returns 405 (Extract Text)
- Endpoint: https://app.developer-api.foxit.com/pdf-services/api/documents/upload
- Symptom: Request failed with status code 405 when calling upload as part of Extract Text flow
- Env observed:
  - FOXIT_PDF_BASE_URL=https://app.developer-api.foxit.com
  - FOXIT_PDF_API_BASE=https://app.developer.api.foxit.com/pdf-services/api (note: dot vs hyphen)
- Notes:
  - We normalize developer.api -> developer-api internally to avoid DNS issues
  - After normalization, service responds 405, likely entitlement/route requirement on current credentials

### Workaround implemented (D34)
- Added local fallback using `pdf-parse` to extract text directly from uploaded PDF
- Flow: try Foxit → if error, fallback to `pdf-parse`, returning `{ text: string }`
- No frontend change required; DocumentDetail shows "Extracted Text" block

### Next steps (D56)
- Verify correct Foxit subscription and enabled APIs in developer console
- Confirm official upload and extract endpoints for our plan; adjust if needed
- Add a credentials health-check route to backend for quick verification
- Optional: feature flag to force local vs Foxit for testing

## 2) Browser password manager warnings (dev)
- Chrome/Google Password Manager may show "Check your saved passwords" in dev
- Not an application bug; safe to dismiss for local testing



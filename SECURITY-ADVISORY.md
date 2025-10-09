# Security Advisory: OAuth Credentials Exposure

## Issue
Sensitive OAuth credentials were previously committed to the repository in `tmp/google-oauth-output.txt`. This file contained:
- Google OAuth authorization URL with client ID
- Instructions to paste authorization codes

## Actions Taken
- ✅ Added `tmp/` and `*.google-oauth-output.txt` to `.gitignore`
- ✅ File is now ignored and cannot be re-committed
- ⚠️ **IMMEDIATE ACTION REQUIRED**: Credentials must be rotated

## Required Actions

### 1. Rotate Google OAuth Credentials (URGENT)
The exposed client ID `603278479855-7456hob4l6a6pfv8u9cu8218s6tusjog.apps.googleusercontent.com` must be immediately rotated:

1. Go to Google Cloud Console
2. Navigate to APIs & Services → Credentials
3. Find the OAuth 2.0 Client ID above
4. **DELETE** the compromised client ID
5. **CREATE** a new OAuth 2.0 Client ID
6. Update any environment variables or configuration files
7. Update the redirect URI to match your new setup

### 2. Check for Additional Exposure
- Verify no authorization codes were ever committed
- Check if any refresh tokens were generated with the compromised client
- Review any recent OAuth activity in Google Cloud Console

### 3. Update Development Practices
- Never commit temporary OAuth output files
- Use environment variables for all sensitive data
- Add `.tmp/`, `tmp/`, and `*.oauth-output.txt` to global gitignore
- Train team on secure credential handling

## Prevention
- All temporary files with credentials now blocked by .gitignore
- Repository history contains the exposure but file cannot be re-added
- Consider repository history cleanup if required (complex process)

## Timeline
- **Issue Discovered**: During routine security scan
- **Immediate Action**: File blocked via .gitignore
- **Required Action**: Rotate credentials within 24 hours

## Contact
If you discover any additional security concerns, please:
1. Immediately revoke the compromised credentials
2. Create a new issue in this repository
3. Report to the project maintainers privately

---
**Severity**: HIGH
**Status**: CREDENTIAL ROTATION REQUIRED
**Next Review**: After credential rotation
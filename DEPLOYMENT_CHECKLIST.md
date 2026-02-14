# Deployment Checklist - Learning Assistant

## Pre-Deployment Verification

### Backend Configuration

- [ ] Verify `GROQ_API_KEY` is set in `Backend/.env`
- [ ] Verify `MYSQL_DATABASE=learning_assistant` in `Backend/.env`
- [ ] Verify database connection with `python test_connection.py`
- [ ] Confirm MySQL is running on configured host/port
- [ ] Check that `vectorstore/ai` and `vectorstore/ml` directories exist with FAISS indices
- [ ] Verify `faiss_groq_app.py` imports all required packages

### Frontend Configuration

- [ ] Verify `Frontend/.env.local` has correct backend API URL
- [ ] Confirm `API_BASE` in `src/lib/api.ts` points to backend
- [ ] Check all routes are imported in `App.tsx`
- [ ] Verify image assets exist (if used)
- [ ] Run `bun install` to install dependencies

### Database Setup

- [ ] Run database migration from `MIGRATION_GUIDE.md`
- [ ] Add `deep_explanation` column to history table
- [ ] Verify tables exist: `users`, `history`
- [ ] Create indexes for performance
- [ ] Test connection with test credentials

### Code Quality Checks

- [ ] No `console.log()` or `console.error()` statements in production code
- [ ] All TypeScript types properly defined
- [ ] No unused imports in components
- [ ] API error handling implemented
- [ ] Loading states properly handled
- [ ] Empty states have proper messaging

## Feature Verification

### Smart Response Flow

- [ ] Test with short question (< 4 words) → Skip RAG ✓
- [ ] Test with subject question → Use RAG + LLM ✓
- [ ] Test with guidance question ("I am stuck") → Mentoring mode ✓
- [ ] Test with empty RAG response → Fallback to LLM ✓
- [ ] Test cache hit on duplicate question ✓
- [ ] Test quality control (reject empty/short answers) ✓

### Deep Explanation Feature

- [ ] "Explain Deeply" button appears for assistant messages ✓
- [ ] Button click triggers academic explanation with analogy ✓
- [ ] Deep explanation not stored in database ✓
- [ ] Multiple clicks work correctly ✓

### History Viewer

- [ ] Click on history date navigates to `/history/:date` ✓
- [ ] Conversation displays in chronological order ✓
- [ ] Read-only mode (no editing) ✓
- [ ] Back button returns to chat ✓

### Authentication

- [ ] Login works with correct credentials
- [ ] Signup creates new user account
- [ ] Session token properly stored
- [ ] Logout clears session data
- [ ] Protected routes redirect to login

### UI/UX

- [ ] No brand names visible (neutral branding) ✓
- [ ] No emojis in UI text (except where intentional)
- [ ] Professional tone throughout ✓
- [ ] Loading states show "Generating response..."
- [ ] Error messages are helpful and clear ✓
- [ ] Mobile responsive layout

## Performance Testing

- [ ] Subject question with RAG: < 5 seconds
- [ ] Mentoring question: < 4 seconds
- [ ] Cache hit: < 100ms
- [ ] No visible lag on UI interactions
- [ ] Chat scrolls smoothly

## Security Checks

- [ ] API keys not in frontend code ✓
- [ ] Password hashing verified in backend
- [ ] CORS configured appropriately
- [ ] Authentication middleware active
- [ ] Input validation on all endpoints
- [ ] No sensitive data in logs

## Browser Compatibility

- [ ] Chrome/Chromium: ✓
- [ ] Firefox: ✓
- [ ] Safari: ✓
- [ ] Edge: ✓
- [ ] Mobile browsers: ✓

## Documentation

- [ ] `PRODUCTION_REFACTORING.md` created ✓
- [ ] `MIGRATION_GUIDE.md` created ✓
- [ ] Architecture documented
- [ ] API endpoints documented
- [ ] Configuration options clear

## Final Deployment Steps

1. **Database Migration**
   ```bash
   # Run SQL commands from MIGRATION_GUIDE.md
   mysql -u root -p < migration_script.sql
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   pip install -r requirements.txt
   # Verify test_connection.py passes
   python test_connection.py
   ```

3. **Frontend Build**
   ```bash
   cd Frontend
   bun install
   bun run build
   ```

4. **Start Services**
   ```bash
   # Terminal 1: Backend
   cd Backend
   python -m uvicorn faiss_groq_app:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2: Frontend
   cd Frontend
   bun run dev
   ```

5. **Smoke Tests**
   - Login with test account
   - Ask subject question
   - Ask guidance question
   - Use "Explain Deeply"
   - Check history viewer
   - Logout

## Post-Deployment

- [ ] Monitor error logs for issues
- [ ] Check database query performance
- [ ] Verify Groq API usage is within limits
- [ ] Monitor response times
- [ ] Collect user feedback
- [ ] Plan improvements based on usage

## Rollback Plan

If critical issues occur:

1. Revert to previous working version
2. Restore database backup: `mysql learning_assistant < backup.sql`
3. Clear browser cache/localStorage
4. Restart all services
5. Run smoke tests again

## Support Contact

For issues during deployment:
- Check logs: `Backend/logs/` (if configured)
- Review `PRODUCTION_REFACTORING.md` for detailed architecture
- Check `MIGRATION_GUIDE.md` for database issues
- Run `test_connection.py` for connectivity issues

---

### Deployment Sign-Off

- [ ] All checks completed
- [ ] Team approval obtained
- [ ] Backup created: `backup_learning_assistant_$(date +%Y%m%d).sql`
- [ ] Monitoring configured
- [ ] Support team notified

**Deployment Date:** _______________
**Deployed By:** _______________
**Notes:** _______________

---

Last Updated: February 9, 2026
Version: 1.0

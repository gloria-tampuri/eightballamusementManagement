# Multi-Operator Transport System Architecture

## Overview

This document outlines the architecture for handling multiple operators in the Transport system with optimal UX/UI experience.

## Key Features Implemented

### 1. **Operator Tracking**

- ✅ Operators captured automatically from `getSignedInEmail()`
- ✅ Stored in MongoDB along with transport data
- ✅ Enables audit trail and operator accountability

### 2. **State Management**

- ✅ `OperatorContext` manages operator filtering state
- ✅ Persistent storage via localStorage
- ✅ Single source of truth for selected operator filter

### 3. **API Endpoints**

#### Core Endpoints:

```
GET /api/transport/operators
- Returns list of unique operators
- Use for populating filter dropdown

GET /api/transport/year?operator=email@domain.com
- Returns distinct years for specific operator
- Optional: omit operator param for all years

GET /api/transport/year/2024?operator=email@domain.com
- Returns all transports for year and optional operator
- Filters in both year and operator dimensions
```

### 4. **Component Structure**

```
Transport (Main Container)
├── TransportForm (Create new transport)
│   └── Captures operator via getSignedInEmail()
├── TransportYears (Year selector)
│   ├── OperatorFilter (Dropdown)
│   └── Links to TransportByMonth
└── TransportByMonth (Detail view)
    ├── OperatorFilter (Persistent filter)
    └── Monthly transport display
```

### 5. **Filter Flow**

1. User selects operator from dropdown
2. OperatorContext updates `selectedOperator`
3. localStorage saves selection
4. All SWR queries automatically include operator in URL
5. Data refetches with new operator filter
6. UI updates seamlessly

### 6. **UX/UI Best Practices Implemented**

#### A. **Persistent Filtering**

```javascript
// Saved to localStorage on selection
localStorage.setItem("selectedOperatorFilter", operator);
// Automatically restored on page refresh
```

#### B. **Responsive Design**

- Mobile-friendly OperatorFilter component
- Flexbox layout that adapts to screen size
- Touch-friendly dropdown

#### C. **Real-time Updates**

- SWR with 1000ms refresh interval
- Automatic cache invalidation on operator change
- No manual refresh needed

#### D. **Accessibility**

- Proper label associations
- Clear visual hierarchy
- Proper color contrast
- Mobile viewport optimized

## Data Flow Diagram

```
User Interaction
    ↓
OperatorFilter Component
    ↓
useOperator() Hook
    ↓
updateSelectedOperator()
    ↓
localStorage + Context Update
    ↓
SWR Query Auto-Updates
    ↓
API Request with ?operator=...
    ↓
MongoDB Query with operator filter
    ↓
Component Re-renders with New Data
```

## Implementation Details

### TransportForm

```javascript
// Auto-captures operator email
const email = await getSignedInEmail();
const pushdata = {
  ...data,
  operator: email, // Stored with each record
  paid: false,
};
```

### OperatorContext

```javascript
// Manages filter state globally
selectedOperator; // Current filter
updateSelectedOperator(); // Updates filter
availableOperators; // List of all operators
```

### API Queries

```javascript
// Automatically includes operator filter
const apiUrl = selectedOperator
  ? `/api/transport/year/${year}?operator=${encodeURIComponent(selectedOperator)}`
  : `/api/transport/year/${year}`;
```

## Database Schema

```javascript
{
  _id: ObjectId,
  transportDate: Date,
  from: String,
  destination: String,
  amount: Number,
  year: String,
  operator: String,        // Email of operator who entered
  paid: Boolean,
  createdAt: Date
}
```

## Future Enhancements

1. **Advanced Filtering**
   - Date range filters
   - Amount range filters
   - Status filters (Paid/Pending)

2. **Multi-Select Operators**
   - Compare operators side-by-side
   - Aggregate reports

3. **Operator Analytics**
   - Per-operator statistics
   - Performance metrics
   - Expense reports

4. **Export/Reporting**
   - Filter and export by operator
   - PDF generation
   - Email delivery

## Migration Notes

For existing data without operator field:

```javascript
// Add operator field to existing documents
db.transport.updateMany(
  { operator: { $exists: false } },
  { $set: { operator: null } },
);
```

Then display with note: "Data entry operator not recorded"

## Testing Checklist

- [ ] Verify operator captured on form submission
- [ ] Confirm filter dropdown shows multiple operators
- [ ] Test filter persistence across page refreshes
- [ ] Verify year list updates with operator filter
- [ ] Check monthly view filters by operator
- [ ] Mobile responsiveness of filter
- [ ] SWR cache behavior with operator changes
- [ ] Performance with large operator count

## Security Considerations

1. **Data Privacy**
   - Each operator can only submit their own data
   - Backend validation on edit/delete endpoints
   - Audit trail via operator field

2. **Admin Functions**
   - Admin can view all operators
   - Admin can filter by any operator
   - Admin can edit/delete any record

## Performance Optimization

1. **Caching Strategy**
   - SWR caches by URL (includes operator param)
   - Separate cache for each operator
   - 1s refresh interval balances freshness & performance

2. **Database Indexes**
   - Create index on `{ operator, year }`
   - Improves filter query performance

```javascript
db.transport.createIndex({ operator: 1, year: 1 });
```

## Deployment Steps

1. Update TransportForm to capture operator ✅
2. Create OperatorContext ✅
3. Create OperatorFilter component ✅
4. Update TransportYears with filter ✅
5. Update TransportByMonth with filter ✅
6. Update API endpoints for operator filtering ✅
7. Create /api/transport/operators endpoint ✅
8. Wrap \_app.js with OperatorProvider ✅
9. Test all flows
10. Deploy to production

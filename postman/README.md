# Kitchenly API - Postman Collection

This directory contains the Postman collection for the Kitchenly API.

## 📥 Import Collection

### Option 1: Import from File
1. Open Postman
2. Click **Import** button
3. Select `Kitchenly_API.postman_collection.json`
4. Click **Import**

### Option 2: Import from URL (if hosted)
1. Open Postman
2. Click **Import** button
3. Select **Link** tab
4. Paste the URL to the collection
5. Click **Continue** and **Import**

## 🔧 Setup

### 1. Configure Variables

The collection uses two variables:

- **`baseUrl`**: API base URL (default: `http://localhost:3000/api/v1`)
- **`authToken`**: JWT authentication token (automatically set after login)

To modify variables:
1. Click on the collection name
2. Go to **Variables** tab
3. Update the **Current Value** for `baseUrl` if needed

### 2. Authentication

The collection automatically handles authentication:

1. **Sign up or Login**: Use the signup or login endpoint
2. **Token Auto-Save**: The token is automatically saved to `authToken` variable
3. **Auto-Authentication**: All protected endpoints use the saved token

## 📚 Collection Structure

### 👤 Users (15 endpoints)
- **Signup** - Register new user
- **Login** - Authenticate and get token
- **Get Current User** - Get authenticated user profile
- **Logout** - Logout user
- **Get All Users** - Admin only
- **Get All Chefs** - Get list of chefs
- **Get All Customers** - Admin only
- **Get User by ID** - Get specific user
- **Update User** - Update user information
- **Delete User** - Delete user account
- **Forgot Password** - Request password reset
- **Reset Password** - Reset with token
- **Set User Location** - Set coordinates
- **Get Nearby Chefs** - Location-based search
- **Get Nearest Chefs** - Find closest chefs

### 🍕 Menu Items (6 endpoints)
- **Get All Menu Items** - Chef/Admin only
- **Create Menu Item** - With image upload
- **Get Chef Menu Items** - Public access
- **Get All Menu Items (Admin)** - Admin only
- **Update Menu Item** - With image upload
- **Delete Menu Item** - Remove item

### 📦 Orders (4 endpoints)
- **Get All Orders** - Role-based filtering
- **Create Order** - Place new order
- **Get Chef Orders** - Chef's received orders
- **Delete Order** - Cancel order

### 💳 Payment (3 endpoints)
- **Create Payment Session** - Stripe integration
- **Get Payment Status** - Check payment status
- **Stripe Webhook** - Webhook handler

## 🚀 Quick Start

### 1. Start the Server
```bash
npm run dev
```

### 2. Test Authentication Flow

1. **Signup**:
   - Open `Users > Signup`
   - Click **Send**
   - Token is automatically saved

2. **Or Login**:
   - Open `Users > Login`
   - Update email/password in body
   - Click **Send**
   - Token is automatically saved

3. **Test Protected Endpoint**:
   - Open any endpoint (e.g., `Users > Get Current User`)
   - Click **Send**
   - Should work with saved token

## 📝 Usage Examples

### Creating a Menu Item

1. Navigate to `Menu Items > Create Menu Item`
2. Update form data:
   - `name`: Your dish name
   - `description`: Description
   - `price`: Price (number)
   - `foodType`: Choose from enum (ITALIAN, CHINESE, etc.)
   - `itemType`: MAINDISH, DRINK, DESSERT, or BEVERAGE
   - `image`: Select image file
3. Click **Send**

### Creating an Order

1. Navigate to `Orders > Create Order`
2. Update form data:
   - `chef_id`: ID of the chef
   - `items`: JSON array of items:
     ```json
     [
       {"menuitem_id": "item_id_1", "quantity": 2},
       {"menuitem_id": "item_id_2", "quantity": 1}
     ]
     ```
   - `image`: Optional order image
3. Click **Send**

### Location-Based Search

1. First set your location:
   - Navigate to `Users > Set User Location`
   - Update `userid` in URL
   - Update latitude/longitude in body
   - Click **Send**

2. Find nearby chefs:
   - Navigate to `Users > Get Nearby Chefs`
   - Update `userid` in URL
   - Optionally set `radius` query parameter
   - Click **Send**

## 🔄 Converting to OpenAPI

You can convert this Postman collection to OpenAPI format:

### Using Postman
1. Select the collection
2. Click the three dots (...)
3. Select **Export**
4. Choose **OpenAPI 3.0**
5. Click **Export**

### Using postman-to-openapi CLI
```bash
# Install converter
npm install -g postman-to-openapi

# Convert collection
p2o postman/Kitchenly_API.postman_collection.json -f openapi.yaml -o options.json
```

### Using online converter
Visit: https://joolfe.github.io/postman-to-openapi/

## 🌍 Environment Setup

### Development Environment
```json
{
  "baseUrl": "http://localhost:3000/api/v1",
  "authToken": ""
}
```

### Production Environment
```json
{
  "baseUrl": "https://api.kitchenly.com/api/v1",
  "authToken": ""
}
```

To create environments:
1. Click **Environments** in sidebar
2. Click **+** to create new environment
3. Add variables: `baseUrl` and `authToken`
4. Set values for each environment
5. Select active environment from dropdown

## 📊 Testing

### Automatic Token Management

The collection includes test scripts that automatically save the JWT token:

```javascript
// In Signup and Login requests
if (pm.response.code === 201 || pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.collectionVariables.set("authToken", jsonData.token);
}
```

### Adding Custom Tests

You can add tests to any request:

1. Select a request
2. Go to **Tests** tab
3. Add test scripts:

```javascript
// Check status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Check response structure
pm.test("Response has data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
});

// Save response data
var jsonData = pm.response.json();
pm.collectionVariables.set("userId", jsonData.data.id);
```

## 🔐 Security Notes

1. **Never commit tokens**: The `authToken` variable should remain empty in the collection file
2. **Use environments**: Store sensitive data in Postman environments (not synced by default)
3. **HTTPS in production**: Always use HTTPS URLs in production environment

## 🛠️ Troubleshooting

### Token Not Working
- Check if token is set: View collection variables
- Re-login to get a fresh token
- Verify token hasn't expired (90 days by default)

### 401 Unauthorized
- Ensure you've logged in first
- Check that `authToken` variable is set
- Verify the endpoint requires authentication

### 403 Forbidden
- Check user role permissions
- Some endpoints are Admin or Chef only
- Verify you're accessing allowed resources

### File Upload Issues
- Ensure `Content-Type` header is not set (Postman handles it)
- Select actual file in form-data
- Check file size limits (10MB max)

## 📚 Additional Resources

- **API Documentation**: Check the main README.md
- **Postman Learning**: https://learning.postman.com/
- **OpenAPI Specification**: https://swagger.io/specification/

## 🆘 Support

For issues or questions:
- Check the main project README
- Email: support@kitchenly.com
- GitHub Issues: [Repository URL]

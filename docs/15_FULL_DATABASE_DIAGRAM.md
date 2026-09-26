# OrderMitra Full Database Schema (Phases 1-5)

Below is the complete Entity Relationship (ER) Diagram for the entire OrderMitra platform vision, including Loyalty, Reviews, Enterprise Branding, and Kitchen Displays.

```mermaid
erDiagram
    %% PHASE 4/5: ENTERPRISE & BRAND
    BRAND ||--o{ OUTLET : "owns"
    BRAND ||--o{ GLOBAL_MENU : "distributes"
    
    %% PHASE 1: CORE (Now linked to Outlet)
    OUTLET ||--o{ STAFF : employs
    OUTLET ||--o{ MENU_CATEGORY : contains
    OUTLET ||--o{ MENU_ITEM : offers
    OUTLET ||--o{ TABLE : manages
    OUTLET ||--o{ ORDER : receives
    OUTLET ||--o{ PROMOTION : runs
    
    %% PHASE 3: KITCHEN & ZONES
    OUTLET ||--o{ KITCHEN_STATION : has
    TABLE ||--o| WAITER_ZONE : "belongs to"
    STAFF ||--o{ SHIFT : works
    
    %% PHASE 1: MENU
    MENU_CATEGORY ||--o{ MENU_ITEM : categorizes
    GLOBAL_MENU ||--o{ MENU_ITEM : "template for"
    
    %% PHASE 1: ORDERING
    TABLE ||--o{ ORDER : hosts
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER ||--o| PAYMENT : processes
    
    %% PHASE 3: KITCHEN ROUTING
    MENU_ITEM ||--o{ ORDER_ITEM : "ordered as"
    KITCHEN_STATION ||--o{ ORDER_ITEM : "prepares"
    
    %% PHASE 2: CUSTOMERS & RETENTION
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER ||--o{ REVIEW : writes
    CUSTOMER ||--o{ LOYALTY_STAMP : earns
    OUTLET ||--o{ LOYALTY_PROGRAM : defines
    LOYALTY_PROGRAM ||--o{ LOYALTY_STAMP : issues
    
    %% PHASE 1 & 2: COMPLIANCE & REVIEWS
    CUSTOMER ||--o{ CONSENT_RECORD : signs
    ORDER ||--o| REVIEW : "gets rated"

    BRAND {
        string id PK
        string name
        string enterprisePlan
    }

    OUTLET {
        string id PK
        string brandId FK
        string name
        string currency
        boolean isActive
    }

    CUSTOMER {
        string id PK
        string phone UK
        string name
        int totalOrders
    }

    STAFF {
        string id PK
        string outletId FK
        string phone
        enum role "OWNER, MANAGER, CHEF, WAITER"
    }

    KITCHEN_STATION {
        string id PK
        string outletId FK
        string name "e.g. Grill, Drinks"
    }

    MENU_ITEM {
        string id PK
        string outletId FK
        string name
        decimal price
        boolean isVeg
    }

    ORDER {
        string id PK
        string outletId FK
        string customerId FK
        string tableId FK
        enum status
        decimal totalAmount
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string menuItemId FK
        string stationId FK
        enum status "QUEUED, COOKING, READY"
    }

    PAYMENT {
        string id PK
        string orderId FK
        decimal amount
        enum status
    }

    PROMOTION {
        string id PK
        string outletId FK
        string code
        decimal discountValue
    }

    REVIEW {
        string id PK
        string orderId FK
        int rating
        string comment
    }

    LOYALTY_STAMP {
        string id PK
        string customerId FK
        int currentStamps
    }
```

-- CreateTable
CREATE TABLE "AdjustmentDetail" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "adjustmentId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "quantity" DOUBLE PRECISION NOT NULL,
    "type" VARCHAR(192) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "AdjustmentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adjustment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "items" DOUBLE PRECISION DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Adjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "clockIn" TEXT NOT NULL,
    "clockInIp" VARCHAR(45) NOT NULL,
    "clockOut" TEXT NOT NULL,
    "clockOutIp" TEXT NOT NULL,
    "clockInOut" BOOLEAN NOT NULL,
    "departEarly" TEXT NOT NULL DEFAULT E'00:00',
    "lateTime" TEXT NOT NULL DEFAULT E'00:00',
    "overtime" TEXT NOT NULL DEFAULT E'00:00',
    "totalWork" TEXT NOT NULL DEFAULT E'00:00',
    "totalRest" TEXT NOT NULL DEFAULT E'00:00',
    "status" TEXT NOT NULL DEFAULT E'present',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "description" VARCHAR(192),
    "image" VARCHAR(192),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(192) NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "email" VARCHAR(192) NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(192) NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "symbol" VARCHAR(192) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "department" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "departmentHeadId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "designation" VARCHAR(192) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeAccount" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "bankName" VARCHAR(192) NOT NULL,
    "bankBranch" VARCHAR(192) NOT NULL,
    "accountNo" VARCHAR(192) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "EmployeeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeExperience" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "title" VARCHAR(192) NOT NULL,
    "companyName" VARCHAR(192) NOT NULL,
    "location" VARCHAR(192),
    "employmentType" VARCHAR(192) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "EmployeeExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(192) NOT NULL,
    "lastname" VARCHAR(192) NOT NULL,
    "username" TEXT NOT NULL,
    "email" VARCHAR(192),
    "phone" VARCHAR(192),
    "country" VARCHAR(192),
    "city" VARCHAR(192),
    "province" VARCHAR(192),
    "zipcode" VARCHAR(192),
    "address" VARCHAR(192),
    "gender" VARCHAR(192) NOT NULL,
    "resume" VARCHAR(192),
    "avatar" VARCHAR(192) DEFAULT E'no_avatar.png',
    "document" VARCHAR(192),
    "birthDate" DATE,
    "joiningDate" DATE,
    "companyId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "designationId" INTEGER NOT NULL,
    "officeShiftId" INTEGER NOT NULL,
    "remainingLeave" BOOLEAN DEFAULT false,
    "totalLeave" BOOLEAN DEFAULT false,
    "hourlyRate" DECIMAL(10,2) DEFAULT 0.00,
    "basicSalary" DECIMAL(10,2) DEFAULT 0.00,
    "employmentType" VARCHAR(192) DEFAULT E'full_time',
    "leavingDate" DATE,
    "maritalStatus" VARCHAR(192) DEFAULT E'single',
    "facebook" VARCHAR(192),
    "skype" VARCHAR(192),
    "whatsapp" VARCHAR(192),
    "twitter" VARCHAR(192),
    "linkedin" VARCHAR(192),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "userId" TEXT NOT NULL,
    "expenseCategoryId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "details" VARCHAR(192) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(192) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaveType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(192) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "leaveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leave" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "leaveTypeId" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "days" VARCHAR(192) NOT NULL,
    "reason" TEXT,
    "attachment" VARCHAR(192),
    "halfDay" BOOLEAN,
    "status" VARCHAR(192) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeShift" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "mondayIn" TEXT,
    "mondayOut" TEXT,
    "tuesdayIn" TEXT,
    "tuesdayOut" TEXT,
    "wednesdayIn" TEXT,
    "wednesdayOut" TEXT,
    "thursdayIn" TEXT,
    "thursdayOut" TEXT,
    "fridayIn" TEXT,
    "fridayOut" TEXT,
    "saturdayIn" TEXT,
    "saturdayOut" TEXT,
    "sundayIn" TEXT,
    "sundayOut" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "OfficeShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPurchaseReturn" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "purchaseReturnId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reglement" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PaymentPurchaseReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentPurchase" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reglement" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PaymentPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSaleReturn" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "saleReturnId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reglement" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PaymentSaleReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSale" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "saleId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reglement" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PaymentSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosSetting" (
    "id" SERIAL NOT NULL,
    "noteCustomer" VARCHAR(192) NOT NULL DEFAULT E'Thank You For Shopping With Us . Please Come Again',
    "showNote" BOOLEAN NOT NULL DEFAULT true,
    "showBarcode" BOOLEAN NOT NULL DEFAULT true,
    "showDiscount" BOOLEAN NOT NULL DEFAULT true,
    "showCustomer" BOOLEAN NOT NULL DEFAULT true,
    "showEmail" BOOLEAN NOT NULL DEFAULT true,
    "showPhone" BOOLEAN NOT NULL DEFAULT true,
    "showAddress" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PosSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER,
    "name" VARCHAR(192),
    "qty" DECIMAL(8,2) DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductWarehouse" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "qty" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "ProductWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(192) NOT NULL,
    "typeBarcode" VARCHAR(192) NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "brandId" INTEGER,
    "unitId" INTEGER,
    "unitSaleId" INTEGER,
    "unitPurchaseId" INTEGER,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "image" TEXT,
    "note" TEXT,
    "stockAlert" DOUBLE PRECISION DEFAULT 0,
    "isVariant" BOOLEAN NOT NULL DEFAULT false,
    "isImei" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "email" VARCHAR(192) NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDetail" (
    "id" SERIAL NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "purchaseUnitId" INTEGER,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "discount" DOUBLE PRECISION DEFAULT 0,
    "discountMethod" VARCHAR(192) DEFAULT E'1',
    "purchaseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "imeiNumber" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PurchaseDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReturnDetail" (
    "id" SERIAL NOT NULL,
    "cost" DECIMAL(16,3) NOT NULL,
    "purchaseUnitId" INTEGER NOT NULL,
    "taxNet" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "discount" DOUBLE PRECISION DEFAULT 0,
    "discountMethod" VARCHAR(192) DEFAULT E'1',
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "purchaseReturnId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "imeiNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PurchaseReturnDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReturn" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "providerId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION DEFAULT 0,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping" DOUBLE PRECISION DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" VARCHAR(192) NOT NULL,
    "status" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "PurchaseReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "date" DATE NOT NULL,
    "providerId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION DEFAULT 0,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping" DOUBLE PRECISION DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "paymentStatus" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationDetail" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "saleUnitId" INTEGER,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "discount" DOUBLE PRECISION DEFAULT 0,
    "discountMethod" VARCHAR(192) DEFAULT E'1',
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "imeiNumber" TEXT,
    "quotationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "QuotationDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "customerId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION DEFAULT 0,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping" DOUBLE PRECISION DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleDetail" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "imeiNumber" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "saleUnitId" INTEGER,
    "taxNet" DOUBLE PRECISION,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "discount" DOUBLE PRECISION,
    "discountMethod" VARCHAR(192) DEFAULT E'1',
    "total" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "SaleDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleReturnDetail" (
    "id" SERIAL NOT NULL,
    "saleReturnId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "saleUnitId" INTEGER,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "discount" DOUBLE PRECISION DEFAULT 0,
    "discountMethod" VARCHAR(192) DEFAULT E'1',
    "productVariantId" INTEGER,
    "imeiNumber" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "SaleReturnDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleReturn" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION DEFAULT 0,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping" DOUBLE PRECISION DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" VARCHAR(192) NOT NULL,
    "status" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "SaleReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "isPos" BOOLEAN DEFAULT false,
    "customerId" INTEGER NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "taxRate" DOUBLE PRECISION DEFAULT 0,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping" DOUBLE PRECISION DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" VARCHAR(192) NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "shippingStatus" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "currencyId" INTEGER,
    "CompanyName" TEXT NOT NULL,
    "CompanyPhone" TEXT NOT NULL,
    "CompanyAdress" TEXT NOT NULL,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "footer" VARCHAR(192) NOT NULL DEFAULT E'',
    "developedBy" VARCHAR(192) NOT NULL DEFAULT E'',
    "customerId" INTEGER,
    "warehouseId" INTEGER,
    "defaultLanguage" VARCHAR(192) NOT NULL DEFAULT E'en',
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ref" VARCHAR(192) NOT NULL,
    "saleId" INTEGER NOT NULL,
    "deliveredTo" VARCHAR(192),
    "shippingAddress" TEXT,
    "status" VARCHAR(192) NOT NULL,
    "shippingDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferDetail" (
    "id" SERIAL NOT NULL,
    "transferId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productVariantId" INTEGER,
    "cost" DOUBLE PRECISION NOT NULL,
    "purchaseUnitId" INTEGER,
    "taxNet" DOUBLE PRECISION,
    "taxMethod" VARCHAR(192) DEFAULT E'1',
    "discount" DOUBLE PRECISION,
    "discountMethod" VARCHAR(192) DEFAULT E'1',
    "quantity" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "TransferDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ref" VARCHAR(192) NOT NULL,
    "date" DATE NOT NULL,
    "fromWarehouseId" INTEGER NOT NULL,
    "toWarehouseId" INTEGER NOT NULL,
    "items" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION DEFAULT 0,
    "taxNet" DOUBLE PRECISION DEFAULT 0,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping" DOUBLE PRECISION DEFAULT 0,
    "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" VARCHAR(192) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "ShortName" VARCHAR(192) NOT NULL,
    "baseUnitId" INTEGER,
    "operator" CHAR(192) DEFAULT E'*',
    "operatorValue" DOUBLE PRECISION DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWarehouse" (
    "userId" TEXT NOT NULL,
    "warehouseId" INTEGER NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "UserWarehouse_pkey" PRIMARY KEY ("userId","warehouseId")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(192) NOT NULL,
    "city" VARCHAR(192),
    "mobile" VARCHAR(192),
    "zip" VARCHAR(192),
    "email" VARCHAR(192),
    "country" VARCHAR(192),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "gh_username" TEXT,
    "username" VARCHAR(192),
    "email" VARCHAR(192),
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "phone" VARCHAR(192),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "isAllWarehouses" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(0),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "siteId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "subdomain" TEXT,
    "customDomain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "tenantId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "image" TEXT,
    "imageBlurhash" TEXT,
    "subdomain" TEXT,
    "customDomain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("tenantId")
);

-- CreateTable
CREATE TABLE "casbin_rule" (
    "id" SERIAL NOT NULL,
    "ptype" TEXT NOT NULL,
    "v0" TEXT,
    "v1" TEXT,
    "v2" TEXT,
    "v3" TEXT,
    "v4" TEXT,
    "v5" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "casbin_rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdjustmentDetail_tenantId_idx" ON "AdjustmentDetail"("tenantId");

-- CreateIndex
CREATE INDEX "AdjustmentDetail_adjustmentId_idx" ON "AdjustmentDetail"("adjustmentId");

-- CreateIndex
CREATE INDEX "AdjustmentDetail_productId_idx" ON "AdjustmentDetail"("productId");

-- CreateIndex
CREATE INDEX "AdjustmentDetail_productVariantId_idx" ON "AdjustmentDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "Adjustment_tenantId_idx" ON "Adjustment"("tenantId");

-- CreateIndex
CREATE INDEX "Adjustment_userId_idx" ON "Adjustment"("userId");

-- CreateIndex
CREATE INDEX "Adjustment_warehouseId_idx" ON "Adjustment"("warehouseId");

-- CreateIndex
CREATE INDEX "Attendance_tenantId_idx" ON "Attendance"("tenantId");

-- CreateIndex
CREATE INDEX "Attendance_companyId_idx" ON "Attendance"("companyId");

-- CreateIndex
CREATE INDEX "Attendance_employeeId_idx" ON "Attendance"("employeeId");

-- CreateIndex
CREATE INDEX "Attendance_userId_idx" ON "Attendance"("userId");

-- CreateIndex
CREATE INDEX "Brand_tenantId_idx" ON "Brand"("tenantId");

-- CreateIndex
CREATE INDEX "Category_tenantId_idx" ON "Category"("tenantId");

-- CreateIndex
CREATE INDEX "Customer_tenantId_idx" ON "Customer"("tenantId");

-- CreateIndex
CREATE INDEX "Company_tenantId_idx" ON "Company"("tenantId");

-- CreateIndex
CREATE INDEX "Currency_tenantId_idx" ON "Currency"("tenantId");

-- CreateIndex
CREATE INDEX "Department_tenantId_idx" ON "Department"("tenantId");

-- CreateIndex
CREATE INDEX "Department_companyId_idx" ON "Department"("companyId");

-- CreateIndex
CREATE INDEX "Department_departmentHeadId_idx" ON "Department"("departmentHeadId");

-- CreateIndex
CREATE INDEX "Designation_tenantId_idx" ON "Designation"("tenantId");

-- CreateIndex
CREATE INDEX "Designation_companyId_idx" ON "Designation"("companyId");

-- CreateIndex
CREATE INDEX "Designation_departmentId_idx" ON "Designation"("departmentId");

-- CreateIndex
CREATE INDEX "EmployeeAccount_tenantId_idx" ON "EmployeeAccount"("tenantId");

-- CreateIndex
CREATE INDEX "EmployeeAccount_employeeId_idx" ON "EmployeeAccount"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeExperience_tenantId_idx" ON "EmployeeExperience"("tenantId");

-- CreateIndex
CREATE INDEX "EmployeeExperience_employeeId_idx" ON "EmployeeExperience"("employeeId");

-- CreateIndex
CREATE INDEX "Employee_tenantId_idx" ON "Employee"("tenantId");

-- CreateIndex
CREATE INDEX "Employee_companyId_idx" ON "Employee"("companyId");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "Employee"("departmentId");

-- CreateIndex
CREATE INDEX "Employee_designationId_idx" ON "Employee"("designationId");

-- CreateIndex
CREATE INDEX "Employee_officeShiftId_idx" ON "Employee"("officeShiftId");

-- CreateIndex
CREATE INDEX "ExpenseCategory_tenantId_idx" ON "ExpenseCategory"("tenantId");

-- CreateIndex
CREATE INDEX "ExpenseCategory_userId_idx" ON "ExpenseCategory"("userId");

-- CreateIndex
CREATE INDEX "Expense_tenantId_idx" ON "Expense"("tenantId");

-- CreateIndex
CREATE INDEX "Expense_expenseCategoryId_idx" ON "Expense"("expenseCategoryId");

-- CreateIndex
CREATE INDEX "Expense_userId_idx" ON "Expense"("userId");

-- CreateIndex
CREATE INDEX "Expense_warehouseId_idx" ON "Expense"("warehouseId");

-- CreateIndex
CREATE INDEX "Holiday_tenantId_idx" ON "Holiday"("tenantId");

-- CreateIndex
CREATE INDEX "Holiday_companyId_idx" ON "Holiday"("companyId");

-- CreateIndex
CREATE INDEX "leaveType_tenantId_idx" ON "leaveType"("tenantId");

-- CreateIndex
CREATE INDEX "Leave_tenantId_idx" ON "Leave"("tenantId");

-- CreateIndex
CREATE INDEX "Leave_companyId_idx" ON "Leave"("companyId");

-- CreateIndex
CREATE INDEX "Leave_departmentId_idx" ON "Leave"("departmentId");

-- CreateIndex
CREATE INDEX "Leave_employeeId_idx" ON "Leave"("employeeId");

-- CreateIndex
CREATE INDEX "Leave_leaveTypeId_idx" ON "Leave"("leaveTypeId");

-- CreateIndex
CREATE INDEX "OfficeShift_tenantId_idx" ON "OfficeShift"("tenantId");

-- CreateIndex
CREATE INDEX "OfficeShift_companyId_idx" ON "OfficeShift"("companyId");

-- CreateIndex
CREATE INDEX "PaymentPurchaseReturn_tenantId_idx" ON "PaymentPurchaseReturn"("tenantId");

-- CreateIndex
CREATE INDEX "PaymentPurchaseReturn_purchaseReturnId_idx" ON "PaymentPurchaseReturn"("purchaseReturnId");

-- CreateIndex
CREATE INDEX "PaymentPurchaseReturn_userId_idx" ON "PaymentPurchaseReturn"("userId");

-- CreateIndex
CREATE INDEX "PaymentPurchase_tenantId_idx" ON "PaymentPurchase"("tenantId");

-- CreateIndex
CREATE INDEX "PaymentPurchase_purchaseId_idx" ON "PaymentPurchase"("purchaseId");

-- CreateIndex
CREATE INDEX "PaymentPurchase_userId_idx" ON "PaymentPurchase"("userId");

-- CreateIndex
CREATE INDEX "PaymentSaleReturn_tenantId_idx" ON "PaymentSaleReturn"("tenantId");

-- CreateIndex
CREATE INDEX "PaymentSaleReturn_saleReturnId_idx" ON "PaymentSaleReturn"("saleReturnId");

-- CreateIndex
CREATE INDEX "PaymentSaleReturn_userId_idx" ON "PaymentSaleReturn"("userId");

-- CreateIndex
CREATE INDEX "PaymentSale_tenantId_idx" ON "PaymentSale"("tenantId");

-- CreateIndex
CREATE INDEX "PaymentSale_saleId_idx" ON "PaymentSale"("saleId");

-- CreateIndex
CREATE INDEX "PaymentSale_userId_idx" ON "PaymentSale"("userId");

-- CreateIndex
CREATE INDEX "PosSetting_tenantId_idx" ON "PosSetting"("tenantId");

-- CreateIndex
CREATE INDEX "ProductVariant_tenantId_idx" ON "ProductVariant"("tenantId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductWarehouse_tenantId_idx" ON "ProductWarehouse"("tenantId");

-- CreateIndex
CREATE INDEX "ProductWarehouse_productVariantId_idx" ON "ProductWarehouse"("productVariantId");

-- CreateIndex
CREATE INDEX "ProductWarehouse_productId_idx" ON "ProductWarehouse"("productId");

-- CreateIndex
CREATE INDEX "ProductWarehouse_warehouseId_idx" ON "ProductWarehouse"("warehouseId");

-- CreateIndex
CREATE INDEX "Product_tenantId_idx" ON "Product"("tenantId");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_unitId_idx" ON "Product"("unitId");

-- CreateIndex
CREATE INDEX "Product_unitSaleId_idx" ON "Product"("unitSaleId");

-- CreateIndex
CREATE INDEX "Product_unitPurchaseId_idx" ON "Product"("unitPurchaseId");

-- CreateIndex
CREATE INDEX "Provider_tenantId_idx" ON "Provider"("tenantId");

-- CreateIndex
CREATE INDEX "PurchaseDetail_tenantId_idx" ON "PurchaseDetail"("tenantId");

-- CreateIndex
CREATE INDEX "PurchaseDetail_productId_idx" ON "PurchaseDetail"("productId");

-- CreateIndex
CREATE INDEX "PurchaseDetail_purchaseId_idx" ON "PurchaseDetail"("purchaseId");

-- CreateIndex
CREATE INDEX "PurchaseDetail_productVariantId_idx" ON "PurchaseDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "PurchaseDetail_purchaseUnitId_idx" ON "PurchaseDetail"("purchaseUnitId");

-- CreateIndex
CREATE INDEX "PurchaseReturnDetail_tenantId_idx" ON "PurchaseReturnDetail"("tenantId");

-- CreateIndex
CREATE INDEX "PurchaseReturnDetail_productId_idx" ON "PurchaseReturnDetail"("productId");

-- CreateIndex
CREATE INDEX "PurchaseReturnDetail_purchaseReturnId_idx" ON "PurchaseReturnDetail"("purchaseReturnId");

-- CreateIndex
CREATE INDEX "PurchaseReturnDetail_productVariantId_idx" ON "PurchaseReturnDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "PurchaseReturnDetail_purchaseUnitId_idx" ON "PurchaseReturnDetail"("purchaseUnitId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_tenantId_idx" ON "PurchaseReturn"("tenantId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_providerId_idx" ON "PurchaseReturn"("providerId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_warehouseId_idx" ON "PurchaseReturn"("warehouseId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_userId_idx" ON "PurchaseReturn"("userId");

-- CreateIndex
CREATE INDEX "Purchase_tenantId_idx" ON "Purchase"("tenantId");

-- CreateIndex
CREATE INDEX "Purchase_providerId_idx" ON "Purchase"("providerId");

-- CreateIndex
CREATE INDEX "Purchase_userId_idx" ON "Purchase"("userId");

-- CreateIndex
CREATE INDEX "Purchase_warehouseId_idx" ON "Purchase"("warehouseId");

-- CreateIndex
CREATE INDEX "QuotationDetail_tenantId_idx" ON "QuotationDetail"("tenantId");

-- CreateIndex
CREATE INDEX "QuotationDetail_productId_idx" ON "QuotationDetail"("productId");

-- CreateIndex
CREATE INDEX "QuotationDetail_quotationId_idx" ON "QuotationDetail"("quotationId");

-- CreateIndex
CREATE INDEX "QuotationDetail_productVariantId_idx" ON "QuotationDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "QuotationDetail_saleUnitId_idx" ON "QuotationDetail"("saleUnitId");

-- CreateIndex
CREATE INDEX "Quotation_tenantId_idx" ON "Quotation"("tenantId");

-- CreateIndex
CREATE INDEX "Quotation_customerId_idx" ON "Quotation"("customerId");

-- CreateIndex
CREATE INDEX "Quotation_userId_idx" ON "Quotation"("userId");

-- CreateIndex
CREATE INDEX "Quotation_warehouseId_idx" ON "Quotation"("warehouseId");

-- CreateIndex
CREATE INDEX "SaleDetail_tenantId_idx" ON "SaleDetail"("tenantId");

-- CreateIndex
CREATE INDEX "SaleDetail_saleId_idx" ON "SaleDetail"("saleId");

-- CreateIndex
CREATE INDEX "SaleDetail_productId_idx" ON "SaleDetail"("productId");

-- CreateIndex
CREATE INDEX "SaleDetail_productVariantId_idx" ON "SaleDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "SaleDetail_saleUnitId_idx" ON "SaleDetail"("saleUnitId");

-- CreateIndex
CREATE INDEX "SaleReturnDetail_tenantId_idx" ON "SaleReturnDetail"("tenantId");

-- CreateIndex
CREATE INDEX "SaleReturnDetail_productId_idx" ON "SaleReturnDetail"("productId");

-- CreateIndex
CREATE INDEX "SaleReturnDetail_saleReturnId_idx" ON "SaleReturnDetail"("saleReturnId");

-- CreateIndex
CREATE INDEX "SaleReturnDetail_productVariantId_idx" ON "SaleReturnDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "SaleReturnDetail_saleUnitId_idx" ON "SaleReturnDetail"("saleUnitId");

-- CreateIndex
CREATE INDEX "SaleReturn_tenantId_idx" ON "SaleReturn"("tenantId");

-- CreateIndex
CREATE INDEX "SaleReturn_clientId_idx" ON "SaleReturn"("clientId");

-- CreateIndex
CREATE INDEX "SaleReturn_userId_idx" ON "SaleReturn"("userId");

-- CreateIndex
CREATE INDEX "SaleReturn_warehouseId_idx" ON "SaleReturn"("warehouseId");

-- CreateIndex
CREATE INDEX "Sale_tenantId_idx" ON "Sale"("tenantId");

-- CreateIndex
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");

-- CreateIndex
CREATE INDEX "Sale_userId_idx" ON "Sale"("userId");

-- CreateIndex
CREATE INDEX "Sale_warehouseId_idx" ON "Sale"("warehouseId");

-- CreateIndex
CREATE INDEX "Setting_tenantId_idx" ON "Setting"("tenantId");

-- CreateIndex
CREATE INDEX "Setting_customerId_idx" ON "Setting"("customerId");

-- CreateIndex
CREATE INDEX "Setting_currencyId_idx" ON "Setting"("currencyId");

-- CreateIndex
CREATE INDEX "Setting_warehouseId_idx" ON "Setting"("warehouseId");

-- CreateIndex
CREATE INDEX "Shipment_tenantId_idx" ON "Shipment"("tenantId");

-- CreateIndex
CREATE INDEX "Shipment_saleId_idx" ON "Shipment"("saleId");

-- CreateIndex
CREATE INDEX "Shipment_userId_idx" ON "Shipment"("userId");

-- CreateIndex
CREATE INDEX "TransferDetail_tenantId_idx" ON "TransferDetail"("tenantId");

-- CreateIndex
CREATE INDEX "TransferDetail_productId_idx" ON "TransferDetail"("productId");

-- CreateIndex
CREATE INDEX "TransferDetail_productVariantId_idx" ON "TransferDetail"("productVariantId");

-- CreateIndex
CREATE INDEX "TransferDetail_transferId_idx" ON "TransferDetail"("transferId");

-- CreateIndex
CREATE INDEX "TransferDetail_purchaseUnitId_idx" ON "TransferDetail"("purchaseUnitId");

-- CreateIndex
CREATE INDEX "Transfer_tenantId_idx" ON "Transfer"("tenantId");

-- CreateIndex
CREATE INDEX "Transfer_fromWarehouseId_idx" ON "Transfer"("fromWarehouseId");

-- CreateIndex
CREATE INDEX "Transfer_toWarehouseId_idx" ON "Transfer"("toWarehouseId");

-- CreateIndex
CREATE INDEX "Transfer_userId_idx" ON "Transfer"("userId");

-- CreateIndex
CREATE INDEX "Unit_tenantId_idx" ON "Unit"("tenantId");

-- CreateIndex
CREATE INDEX "Unit_baseUnitId_idx" ON "Unit"("baseUnitId");

-- CreateIndex
CREATE INDEX "UserWarehouse_tenantId_idx" ON "UserWarehouse"("tenantId");

-- CreateIndex
CREATE INDEX "UserWarehouse_userId_idx" ON "UserWarehouse"("userId");

-- CreateIndex
CREATE INDEX "UserWarehouse_warehouseId_idx" ON "UserWarehouse"("warehouseId");

-- CreateIndex
CREATE INDEX "Warehouse_tenantId_idx" ON "Warehouse"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_siteId_key" ON "Post"("id", "siteId");

-- CreateIndex
CREATE UNIQUE INDEX "Site_subdomain_key" ON "Site"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Site_customDomain_key" ON "Site"("customDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_customDomain_key" ON "Tenant"("customDomain");


DO -- Create a loop over all tables to create a policy and enable it for them
$$
DECLARE row record;
BEGIN FOR row IN
SELECT t.table_schema,
    t.table_name
FROM information_schema.tables t
    INNER JOIN information_schema.columns c ON c.table_name = t.table_name
    AND c.table_schema = t.table_schema
WHERE c.column_name = 'tenantId'
    AND t.table_schema NOT IN ('information_schema', 'pg_catalog')
    AND t.table_type = 'BASE TABLE'
    AND t.table_schema = 'public'
ORDER BY t.table_schema LOOP EXECUTE format(
        'ALTER TABLE %I ENABLE ROW LEVEL SECURITY;',
        row.table_name
    );
EXECUTE format(
    'CREATE POLICY tenant_isolation_policy ON %I 
                            USING ("tenantId" = current_setting(''app.CurrentTenant'')::TEXT);',
    row.table_name);
-- Escape ' !
END LOOP;
END;
$$;
-- SELECT tablename FROM pg_tables AS t
--         WHERE t.schemaname = 'public' 
--         AND NOT t.tablename ~* 'exclude|tables|regex'

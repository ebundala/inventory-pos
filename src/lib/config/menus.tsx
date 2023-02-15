
import {
    BsAlarm, BsArrowBarLeft, BsArrowBarRight, BsArrowLeftRight, BsAward, BsBarChart, BsCalculator,
    BsCashCoin,
    BsCurrencyExchange, BsGear, BsGenderAmbiguous,
    BsGraphUp, BsPieChart, BsReceipt, BsShieldCheck, BsShop, BsThermometer, BsUnlock
} from "react-icons/bs";
import { FaAccessibleIcon, FaBaby, FaBarcode, FaWarehouse } from "react-icons/fa";
import { FcDataBackup } from "react-icons/fc";
import { LinkMenuData } from "@/types/LinkMenuData";

export const menus: LinkMenuData[] = [
    {
        name: "Dashboard",
        link: '/',
        icon: <BsReceipt size={32} />,
        subMenus: []
    },
    {
        name: "Products",
        link: '#',
        icon: <BsShop size={32} />,
        subMenus: [
            {
                name: "Create Products",
                link: '/products/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Products",
                link: '/products',
                icon: <BsCalculator />,
                subMenus: []
            },
            {
                name: "Category",
                link: '/products/categories',
                icon: <BsGenderAmbiguous />,
                subMenus: []
            },
            {
                name: "Print Barcode",
                link: '/product/barcode',
                icon: <FaBarcode />,
                subMenus: []
            },
            {
                name: "Brands",
                link: '/products/brands',
                icon: <BsAlarm />,
                subMenus: []
            },
            {
                name: "Units",
                link: '/products/units',
                icon: <BsUnlock />,
                subMenus: []
            }
        ]
    },
    {
        name: "Adjustment",
        link: '#',
        icon: <BsThermometer size={32} />,
        subMenus: [
            {
                name: "Create adjustment",
                link: '/adjustments/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All adjustment",
                link: '/adjustments',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Quatations",
        link: '#',
        icon: <BsPieChart size={32} />,
        subMenus: [
            {
                name: "Create Quatation",
                link: '/quotations/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Quatation",
                link: '/quotations',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Purchases",
        link: '#',
        icon: <BsBarChart size={32} />,
        subMenus: [
            {
                name: "Create Purchase",
                link: '/purchases/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Purchases",
                link: '/purchases',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Sales",
        link: '#',
        icon: <BsGraphUp size={32} />,
        subMenus: [
            {
                name: "Create Sales",
                link: '/sales/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Sales",
                link: '/sales',
                icon: <BsCalculator />,
                subMenus: []
            },
            {
                name: "Shipments",
                link: '/sales/shipments',
                icon: <BsGenderAmbiguous />,
                subMenus: []
            },
        ]
    },
    {
        name: "Transfers",
        link: '#',
        icon: <BsArrowLeftRight size={32} />,
        subMenus: [
            {
                name: "Create Transfers",
                link: '/transfers/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Transfers",
                link: '/transfers',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Sale returns",
        link: '#',
        icon: <BsArrowBarRight size={32} />,
        subMenus: [
            {
                name: "Create Sale returns",
                link: '/sale-returns/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All sale returns",
                link: '/sale-returns',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Purchase returns",
        link: '#',
        icon: <BsArrowBarLeft size={32} />,
        subMenus: [
            {
                name: "Create Purchase returns",
                link: '/purchase-returns/create',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Purchases returns",
                link: '/purchase-returns',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Peoples",
        link: '#',
        icon: <FaBaby size={32} />,
        subMenus: [
            {
                name: "Customers",
                link: '/peoples/customers',
                icon: <FaAccessibleIcon />,
                subMenus: []
            },
            {
                name: "Suppliers",
                link: '/peoples/suppliers',
                icon: <BsCalculator />,
                subMenus: []
            },
            {
                name: "Users",
                link: '/peoples/users',
                icon: <BsCalculator />,
                subMenus: []
            }
        ]
    },
    {
        name: "Settings",
        link: '#',
        icon: <BsGear size={32} />,
        subMenus: [
           
            {
                name: "System settings",
                link: '/settings/system',
                icon: <BsGear />,
                subMenus: []
            },
            {
                name: "Users permissions",
                link: '/settings/roles',
                icon: <BsShieldCheck />,
                subMenus: []
            },
            {
                name: "Warehouses",
                link: '/settings/warehouse',
                icon: <FaWarehouse />,
                subMenus: []
            },
            {
                name: "Currency",
                link: '/settings/currency',
                icon: <BsCurrencyExchange />,
                subMenus: []
            },
            {
                name: "Backup",
                link: '/settings/backup',
                icon: <FcDataBackup />,
                subMenus: []
            }
        ]
    }
];

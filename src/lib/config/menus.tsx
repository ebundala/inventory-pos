
import {
    BsAlarm, BsArrowBarLeft, BsArrowBarRight, BsArrowLeftRight, BsAward, BsBarChart, BsCalculator,
    BsCurrencyExchange, BsGear, BsGenderAmbiguous,
    BsGraphUp, BsPieChart, BsReceipt, BsShieldCheck, BsShop, BsThermometer, BsUnlock
} from "react-icons/bs";
import { FaAccessibleIcon, FaBaby, FaBarcode, FaWarehouse } from "react-icons/fa";
import { FcDataBackup } from "react-icons/fc";
import { LinkMenuData } from "@/types/LinkMenuData";

export const menus: LinkMenuData[] = [
    {
        name: "Dashboard",
        link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Products",
                link: '#',
                icon: <BsCalculator />,
                subMenus: []
            },
            {
                name: "Category",
                link: '#',
                icon: <BsGenderAmbiguous />,
                subMenus: []
            },
            {
                name: "Print Barcode",
                link: '#',
                icon: <FaBarcode />,
                subMenus: []
            },
            {
                name: "Brands",
                link: '#',
                icon: <BsAlarm />,
                subMenus: []
            },
            {
                name: "Units",
                link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All adjustment",
                link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Quatation",
                link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Purchases",
                link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Sales",
                link: '#',
                icon: <BsCalculator />,
                subMenus: []
            },
            {
                name: "Shipments",
                link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Transfers",
                link: '#',
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
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Purchases",
                link: '#',
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
                name: "Create Sale returns",
                link: '#',
                icon: <BsAward />,
                subMenus: []
            },
            {
                name: "All Purchases",
                link: '#',
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
                link: '#',
                icon: <FaAccessibleIcon />,
                subMenus: []
            },
            {
                name: "Suppliers",
                link: '#',
                icon: <BsCalculator />,
                subMenus: []
            },
            {
                name: "Users",
                link: '#',
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
                link: '#',
                icon: <BsGear />,
                subMenus: []
            },
            {
                name: "Users permissions",
                link: '#',
                icon: <BsShieldCheck />,
                subMenus: []
            },
            {
                name: "Warehouses",
                link: '#',
                icon: <FaWarehouse />,
                subMenus: []
            },
            {
                name: "Currency",
                link: '#',
                icon: <BsCurrencyExchange />,
                subMenus: []
            },
            {
                name: "Backup",
                link: '#',
                icon: <FcDataBackup />,
                subMenus: []
            }
        ]
    }
];

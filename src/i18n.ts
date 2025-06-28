// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                heroTitle: "Turning Travel Dreams Into Reality & Unforgettable Adventures",
                planTrip: "Plan Your Trip",
                browseTours: "Browse Tours",
                destination: "Enter your Destination",
                category1: "Sight Seeing",
                category2: "City Tour",
                category3: "Train Experience",
                footerAbout: "Explore the world with us. Turning travel dreams into unforgettable adventures.",
                quickLinks: "Quick Links",
                nav: {
                    home: "Home",
                    about: "About Us",
                    packages: "Packages",
                    services: "Services",
                    partners: "Partners",
                    dashboard: "User Dashboard",
                    admin: "Admin Dashboard",
                    language: "Language"
                },
                searchBar: {
                    introText: "Let one of our expert Trip Planners craft your ideal journey, free of charge!",
                    selectDestination: "Select Destination",
                    phonePlaceholder: "Please enter a phone number (8 digits)",
                    emailPlaceholder: "Please enter an email",
                    customizeTripButton: "Customize My Trip",
                    phoneRequired: "Phone number is required.",
                    phoneLengthError: "Phone number must be exactly 8 digits long.",
                    emailRequired: "Email is required.",
                    emailInvalid: "Invalid email format.",
                    alreadyLoggedIn: "You are already logged in as {{user}}. Proceeding to customize your trip!",
                    logoutButton: "Logout ({{user}})",
                    loggedInStatus: "You are logged in as {{user}}."
                },
                destinations: {
                    thailand: "Thailand",
                    vietnam: "Vietnam",
                    europe: "Europe",
                    turkey: "Turkey",
                    yunnan: "Yunnan",
                    beijing: "Beijing",
                    shanghai: "Shanghai",
                    sichuan: "Sichuan",
                    chongqing: "Chongqing",
                    china: "China",
                    xinjiang: "Xinjiang",
                    guizhou: "Guizhou",
                    guangxi: "Guangxi",
                    guangdong: "Guangdong",
                    japan: "Japan",
                    dubai: "Dubai",
                    saudiarabia: "Saudi Arabia"
                },
                loginModal: {
                    title: "Login / Sign Up",
                    demoHint: "Use username: `user` and password: `password` to log in, or use Google.",
                    orSeparator: "OR",
                    usernameLabel: "Username:",
                    usernamePlaceholder: "Enter your username",
                    passwordLabel: "Password:",
                    passwordPlaceholder: "********",
                    closeButton: "Close",
                    loginButton: "Login",
                    invalidCredentials: "Invalid username or password.",
                    googleLoginFailed: "Google login failed. Please try again.",
                    loadingGoogle: "Loading Google Sign-In..." // Added new key
                }
            },
        },
        mn: {
            translation: {
                heroTitle: "Аяллын мөрөөдлийг бодит болгох гайхалтай адал явдлууд",
                planTrip: "Аяллаа төлөвлөх",
                browseTours: "Аяллуудыг үзэх",
                destination: "Очих газрын нэрийг оруулна уу",
                category1: "Үзвэр үйлчилгээ",
                category2: "Хотын аялал",
                category3: "Галт тэрэгний аялал",
                footerAbout: "Бидэнтэй хамт дэлхийгээр аял. Аяллын мөрөөдлөө бодит болгоорой.",
                quickLinks: "Холбоосууд",
                nav: {
                    home: "Нүүр",
                    about: "Бидний тухай",
                    packages: "Аяллын багц",
                    services: "Үйлчилгээ",
                    partners: "Хамтрагчид",
                    dashboard: "Хэрэглэгчийн самбар",
                    admin: "Админ самбар",
                    language: "Хэл"
                },
                searchBar: {
                    introText: "Манай аялал төлөвлөгчдөөр мөрөөдлийн аяллаа үнэгүй төлөвлүүлээрэй!",
                    selectDestination: "Аялах газраа сонгоно уу",
                    phonePlaceholder: "Утасны дугаараа оруулна уу (8 оронтой)",
                    emailPlaceholder: "Имэйл хаягаа оруулна уу",
                    customizeTripButton: "Аяллаа захиалах",
                    phoneRequired: "Утасны дугаар заавал оруулна.",
                    phoneLengthError: "Утасны дугаар 8 оронтой байх ёстой.",
                    emailRequired: "Имэйл хаяг заавал оруулна.",
                    emailInvalid: "Имэйл хаяг буруу форматтай байна.",
                    alreadyLoggedIn: "Та {{user}} нэрээр нэвтэрсэн байна. Аяллаа захиалах хэсэг рүү шилжиж байна!",
                    logoutButton: "Гарах ({{user}})",
                    loggedInStatus: "Та {{user}} нэрээр нэвтэрсэн байна."
                },
                destinations: {
                    thailand: "Тайланд",
                    vietnam: "Вьетнам",
                    europe: "Европ",
                    turkey: "Турк",
                    yunnan: "Юньнань",
                    beijing: "Бээжин",
                    shanghai: "Шанхай",
                    sichuan: "Сычуань",
                    chongqing: "Чунцин",
                    china: "Хятад",
                    xinjiang: "Шинжаан",
                    guizhou: "Гуйжоу",
                    guangxi: "Гуанши",
                    guangdong: "Гуандун",
                    japan: "Япон",
                    dubai: "Дубай",
                    saudiarabia: "Саудын Араб"
                },
                loginModal: {
                    title: "Нэвтрэх / Бүртгүүлэх",
                    demoHint: "`user` хэрэглэгчийн нэр, `password` нууц үгээр эсвэл Google-ээр нэвтэрнэ үү.",
                    orSeparator: "ЭСВЭЛ",
                    usernameLabel: "Хэрэглэгчийн нэр:",
                    usernamePlaceholder: "Хэрэглэгчийн нэрээ оруулна уу",
                    passwordLabel: "Нууц үг:",
                    passwordPlaceholder: "********",
                    closeButton: "Хаах",
                    loginButton: "Нэвтрэх",
                    invalidCredentials: "Буруу хэрэглэгчийн нэр эсвэл нууц үг.",
                    googleLoginFailed: "Google-ээр нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.",
                    loadingGoogle: "Google нэвтрэх хэсгийг ачаалж байна..." // Added new key
                }
            },
        },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
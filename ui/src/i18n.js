import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      "Welcome": "Welcome",
      "Login": "Login",
      "Register": "Register",
      "Email": "Email Address",
      "Password": "Password",
      "Admin Dashboard": "Admin Dashboard",
      "Parent Dashboard": "Parent Dashboard",
      "Manage Teachers": "Manage Teachers",
      "Update Attendance": "Update Attendance",
      "Reports": "Reports",
      "Submit Report": "Submit Report",
      "View Attendance": "View Attendance",
      "Logout": "Logout",
    }
  },
  te: {
    translation: {
      "Welcome": "స్వాగతం",
      "Login": "లాగిన్",
      "Register": "నమోదు",
      "Email": "ఈమెయిల్",
      "Password": "పాస్‌వర్డ్",
      "Admin Dashboard": "అడ్మిన్ డ్యాష్‌బోర్డ్",
      "Parent Dashboard": "తల్లిదండ్రుల డ్యాష్‌బోర్డ్",
      "Manage Teachers": "ఉపాధ్యాయులను నిర్వహించండి",
      "Update Attendance": "హాజరు నవీకరించండి",
      "Reports": "నివేదికలు",
      "Submit Report": "నివేదిక సమర్పించండి",
      "View Attendance": "హాజరు వీక్షించండి",
      "Logout": "లాగ్అవుట్ చేయండి",
    }
  },
  hi: {
    translation: {
      "Welcome": "स्वागत है",
      "Login": "लॉग इन करें",
      "Register": "पंजीकरण करें",
      "Email": "ईमेल पता",
      "Password": "पासवर्ड",
      "Admin Dashboard": "व्यवस्थापक डैशबोर्ड",
      "Parent Dashboard": "अभिभावक डैशबोर्ड",
      "Manage Teachers": "शिक्षकों का प्रबंधन करें",
      "Update Attendance": "उपस्थिति अद्यतन करें",
      "Reports": "रिपोर्ट्स",
      "Submit Report": "रिपोर्ट जमा करें",
      "View Attendance": "उपस्थिति देखें",
      "Logout": "लॉग आउट",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useLocalStorage('theme', 'dark');
    const [language, setLanguage] = useLocalStorage('language', 'ka');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ka' ? 'en' : 'ka');
    };

    const value = {
        theme,
        toggleTheme,
        language,
        toggleLanguage
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
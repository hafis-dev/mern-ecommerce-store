import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import styles from "./themeToggle.module.css";

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className={styles.switchWrapper} onClick={toggleTheme}>
            <div className={`${styles.switch} ${theme === "dark" ? styles.dark : ""}`}>
                <div className={styles.circle}></div>
            </div>
        </div>
    );
};

export default ThemeToggleButton;

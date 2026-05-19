import { useState } from "react";

// import styles from "../styles/CardProfileLayout.module.css";
import styles from "@/modules/plmn/styles/CardProfileLayout.module.css";

import CardProfiles from "./CardProfiles";

const NAV_TABS = [
    "Card Profiles",
    "Tab2",
    "Tab3"
];

function CardProfileLayout() {

    const [activeTab, setActiveTab] =
        useState("Card Profiles");

    return (

        <div className={styles.wrapper}>

            {/* TOP NAVIGATION */}
            <div className={styles.topNav}>

                <div className={styles.navLinks}>

                    {NAV_TABS.map((tab) => (

                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={
                                activeTab === tab
                                    ? styles.navLinkActive
                                    : styles.navLink
                            }
                        >
                            {tab}
                        </button>

                    ))}

                </div>

            </div>

            {/* BODY */}
            <div className={styles.body}>

                {activeTab === "Card Profiles" &&
                    <CardProfiles />
                }

                {activeTab === "Tab2" && (
                    <div className={styles.centerBox}>
                        Tab2 Content
                    </div>
                )}

                {activeTab === "Tab3" && (
                    <div className={styles.centerBox}>
                        Tab3 Content
                    </div>
                )}

            </div>

        </div>

    );
}

export default CardProfileLayout;
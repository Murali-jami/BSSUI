import React, { useEffect, useMemo, useState } from "react";

import {
    Pencil,
    CircleCheckBig
} from "lucide-react";

import styles from "../styles/CardProfiles.module.css";
import { useSelector } from "react-redux";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function CardProfiles() {

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [pageSize, setPageSize] = useState(10);

    const [selectedRow, setSelectedRow] = useState(null);

    const [tableData, setTableData] = useState([]);

    const user = useSelector((state) => state.auth.user);
    const userName = user?.userName || 'User';
    const networkName = user?.networkName || 'Network';
    // const networkId = user?.networkId || null;
    const networkId = 16;
    
    /* FETCH CARD PROFILES */

    useEffect(() => {

        fetch(
            `http://10.10.22.70:8080/api/card-profile/cardProfiles?networkId=${networkId}`
        )
            .then((res) => res.json())
            .then((data) => {

                const formattedData = data.map((item) => ({

                    id: item.profileId,

                    profileName: item.profileName,

                    category: item.categoryName,

                    statusCode: item.status,

                    status:
                        item.status === "AC"
                            ? "Approved"
                            : item.status === "UA"
                                ? "Created"
                                : item.status === "RJ"
                                    ? "Rejected"
                                    : item.status

                }));

                setTableData(formattedData);

            })
            .catch((err) => {

                console.error(
                    "Error fetching profiles:",
                    err
                );

            });

    }, [networkId]);

    /* VIEW */

    const handleView = (row) => {

        console.log("VIEW PROFILE :", row);

        // navigate("/view-profile", { state: row });

    };

    /* SEARCH */

    const filteredData = useMemo(() => {

        const q = search.toLowerCase().trim();

        if (!q) return tableData;

        return tableData.filter((item) =>
            item.profileName.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );

    }, [search, tableData]);

    /* PAGINATION */

    const paginatedData = useMemo(() => {

        const start =
            (currentPage - 1) * pageSize;

        return filteredData.slice(
            start,
            start + pageSize
        );

    }, [filteredData, currentPage, pageSize]);

    const totalPages =
        Math.ceil(filteredData.length / pageSize);

    return (

        <div className={styles.page}>

            <div className={styles.scrollBody}>

                {/* TOP BAR */}

                <div className={styles.topBar}>

                    <div>

                        <h2 className={styles.pageTitle}>
                            Card Profiles
                        </h2>

                        <p className={styles.resultInfo}>
                            {filteredData.length} profiles total
                        </p>

                    </div>

                    <div className={styles.rightBar}>

                        {/* SEARCH */}

                        <div className={styles.searchWrap}>

                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                className={styles.searchInput}
                                value={search}
                                onChange={(e) => {

                                    setSearch(e.target.value);

                                    setCurrentPage(1);

                                }}
                            />

                            {search && (

                                <button
                                    className={styles.clearBtn}
                                    onClick={() => {

                                        setSearch("");

                                        setCurrentPage(1);

                                    }}
                                >
                                    ✕
                                </button>

                            )}

                        </div>

                        {/* CREATE */}

                        <button className={styles.createBtn}>
                            + Create Profile
                        </button>

                    </div>

                </div>

                {/* TABLE */}

                <div className={styles.tableCard}>

                    <table className={styles.table}>

                        <thead className={styles.thead}>

                            <tr>

                                <th className={styles.radioTh}></th>

                                <th className={styles.th}>
                                    PROFILE NAME
                                </th>

                                <th className={styles.th}>
                                    CARD CATEGORY
                                </th>

                                <th className={styles.th}>
                                    STATUS
                                </th>

                                <th className={styles.th}>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedData.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className={styles.emptyCell}
                                    >
                                        No profiles found
                                    </td>

                                </tr>

                            ) : (

                                paginatedData.map((row, index) => (

                                    <tr
                                        key={index}
                                        className={styles.clickableRow}
                                        onClick={() => handleView(row)}
                                    >

                                        {/* RADIO */}

                                        <td
                                            className={styles.radioTd}
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >

                                            <div
                                                className={styles.radioWrapper}
                                                onClick={(e) => {

                                                    e.stopPropagation();

                                                    if (selectedRow === row.id) {
                                                        setSelectedRow(null);
                                                    } else {
                                                        setSelectedRow(row.id);
                                                    }

                                                }}
                                            >

                                                <div
                                                    className={
                                                        selectedRow === row.id
                                                            ? styles.radioSelected
                                                            : styles.radioCircle
                                                    }
                                                />

                                            </div>

                                        </td>

                                        {/* PROFILE */}

                                        <td className={styles.td}>
                                            {row.profileName}
                                        </td>

                                        {/* CATEGORY */}

                                        <td className={styles.td}>
                                            {row.category}
                                        </td>

                                        {/* STATUS */}

                                        <td className={styles.td}>

                                            <span
                                                className={
                                                    row.status === "Approved"
                                                        ? styles.badgeApproved
                                                        : row.status === "Rejected"
                                                            ? styles.badgeRejected
                                                            : styles.badgeCreated
                                                }
                                            >
                                                {row.status}
                                            </span>

                                        </td>

                                        {/* ACTIONS */}

                                        <td className={styles.td}>

                                            <div className={styles.actionLinks}>

                                                {/* MODIFY */}

                                                <span
                                                    className={
                                                        row.statusCode === "UA"
                                                            ? styles.actionLink
                                                            : styles.disabledAction
                                                    }
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        if (
                                                            row.statusCode !== "UA"
                                                        ) return;

                                                        console.log(
                                                            "MODIFY :",
                                                            row
                                                        );

                                                    }}
                                                >
                                                    <Pencil size={14} />

                                                    Modify
                                                </span>

                                                <span className={styles.separator}>
                                                    |
                                                </span>

                                                {/* APPROVE / REJECT */}

                                                <span
                                                    className={
                                                        row.statusCode === "UA"
                                                            ? styles.actionLink
                                                            : styles.disabledAction
                                                    }
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        if (
                                                            row.statusCode !== "UA"
                                                        ) return;

                                                        console.log(
                                                            "APPROVE/REJECT :",
                                                            row
                                                        );

                                                    }}
                                                >
                                                    <CircleCheckBig size={14} />

                                                    Approve / Reject
                                                </span>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                {/* PAGINATION */}

                <div className={styles.paginationBar}>

                    <div className={styles.perPageRow}>

                        <span>
                            View:
                        </span>

                        <select
                            className={styles.perPageSelect}
                            value={pageSize}
                            onChange={(e) => {

                                setPageSize(Number(e.target.value));

                                setCurrentPage(1);

                            }}
                        >
                            {PAGE_SIZE_OPTIONS.map((n) => (

                                <option
                                    key={n}
                                    value={n}
                                >
                                    {n}
                                </option>

                            ))}
                        </select>

                    </div>

                    <div className={styles.pageNumbers}>

                        <button
                            className={
                                currentPage === 1
                                    ? styles.pageBtnDisabled
                                    : styles.pageBtn
                            }
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(currentPage - 1)
                            }
                        >
                            ‹
                        </button>

                        {[...Array(totalPages)].map((_, i) => {

                            const page = i + 1;

                            return (

                                <button
                                    key={page}
                                    className={
                                        page === currentPage
                                            ? styles.pageBtnActive
                                            : styles.pageBtn
                                    }
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                >
                                    {page}
                                </button>

                            );

                        })}

                        <button
                            className={
                                currentPage === totalPages
                                    ? styles.pageBtnDisabled
                                    : styles.pageBtn
                            }
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage(currentPage + 1)
                            }
                        >
                            ›
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default CardProfiles;
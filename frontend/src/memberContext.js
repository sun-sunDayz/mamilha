import React, { createContext, useState, useContext } from 'react';

const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
    const [memberData, setMemberData] = useState(null);

    const updateMemberData = (newData) => {
        setMemberData((prevData) => ({ ...prevData, ...newData }));
    };

    const clearMemberData = () => {
        setMemberData(null)
    }

    return (
        <MemberContext.Provider value={{ memberData, updateMemberData, clearMemberData }}>
            {children}
        </MemberContext.Provider>
    );
};

export const useMemberContext = () => useContext(MemberContext);

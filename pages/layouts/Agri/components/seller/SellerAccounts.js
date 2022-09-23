import React, { useState, useEffect, useContext, Fragment } from 'react';
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import { useRouter } from 'next/router'
import SellerAccountInfo from './SellerAccountInfo';
import SellerAccountPlan from './SellerAccountPlan';

const Accounts = ({membershipTypes}) => {
    const router = useRouter()

    const [tabIndex, setTabIndex] = useState(0);

    useEffect(()=>{
        const active = router.query?.active
        if (active && active=="plan") {
            setTabIndex(1)
        }
    }, [])

    return (
        <Fragment>
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList className="nav nav-tabs tab-coupon">
                    <Tab className="nav-link">My Account Information</Tab>
                    <Tab className="nav-link">My Plan</Tab>
                </TabList>
                <TabPanel>
                    <SellerAccountInfo/>
                </TabPanel>
                <TabPanel>
                    <SellerAccountPlan 
                        membershipTypes={membershipTypes}
                    />
                </TabPanel >
            </Tabs >
        </Fragment>
    )
}

export default Accounts;

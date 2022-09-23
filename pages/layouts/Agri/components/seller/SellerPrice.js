import React, {useState, Fragment, useContext} from 'react';
import {  Table  } from 'reactstrap';
import { format } from 'date-fns'
import SettingContext from '../../../../../helpers/theme-setting/SettingContext';

const MyPrice = ({pricinglogs, producesSeller, produces}) => {
    const settingContext = useContext(SettingContext)

    const packagings = settingContext.appData.produce_packaging
    const sizes = settingContext.appData.produce_sizes

    const formatDate = (dateStr) => {
        const date = dateStr.split(" ")[0]
        const year = parseInt(date.split("-")[0])
        const month = parseInt(date.split("-")[1])
        const day = parseInt(date.split("-")[2])

        return format(new Date(year, month-1, day), 'dd MMM yyyy')
    }

    return (
        <Fragment>
            <section className="ratio_45 section-b-space">
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Produce</th>
                            <th>Type</th>
                            <th>Packaging</th>
                            <th>Size</th>
                            <th>Price US$(FOB) / ton</th>
                            <th>From Date</th>
                            <th>To Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pricinglogs.map(log => {
                                const user_produce = producesSeller.find(item=>item.numeric_id === log.produceISbb_agrix_users_produceID)
                                const produce = produces.find(p=>p.numeric_id === user_produce.produce_sub_categoryISbb_agrix_produce_typesID)
                                const type = produces.find(p=>p.numeric_id === user_produce.produce_typeISbb_agrix_produce_typesID)
                                const packaging = packagings.find(p=>p.numeric_id === user_produce.packagingISbb_agrix_produce_packagingID)
                                const size = sizes.find(s=>s.numeric_id === user_produce.sizeISbb_agrix_produce_sizesID)
                                return (
                                    <tr key={log._id}>
                                        <td>{formatDate(log._datemodified)}</td>
                                        <td>{produce?.name}</td>
                                        <td>{type?.name}</td>
                                        <td>{packaging?.name}</td>
                                        <td>{size?.name}</td>
                                        <td>{parseFloat(log.priceNUM).toFixed(2)}</td>
                                        <td>{formatDate(log.from_date)}</td>
                                        <td>{formatDate(log.to_date)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>  
            </section>            
        </Fragment>
    )
}

export default MyPrice;
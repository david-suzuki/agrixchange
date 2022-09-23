import React from 'react';
import { Table } from 'reactstrap';
import { format } from 'date-fns'

const SellerReports = ({reportsForSeller, onEdit, onDelete}) => {

    const formatDate = (dateStr) => {
        const date = dateStr.split(" ")[0]
        const year = parseInt(date.split("-")[0])
        const month = parseInt(date.split("-")[1])
        const day = parseInt(date.split("-")[2])

        return format(new Date(year, month-1, day), 'dd MMM yyyy')
    }

    return (
        <Table bordered responsive>
            <thead>
                <tr style={{ textAlign: 'center'}}>
                    <th>Date</th>
                    <th>Produce</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            {
                reportsForSeller.map(report=>{

                    const produceData = report.produce_sub_categoryISbb_agrix_produce_typesID_data
                    const produceName = produceData ? produceData.name : ""

                    return (
                        <tr style={{ textAlign: 'center'}} key={report.numeric_id}>
                            <td>{formatDate(report._datemodified)}</td>
                            <td>{produceName}</td>
                            <td>{report.name}</td>
                            <td>{
                                (report.countryISbb_agrix_countriesID_data ? report.countryISbb_agrix_countriesID_data.name : "") + " " +
                                (report.regionISbb_agrix_countriesID_data ? report.regionISbb_agrix_countriesID_data.name : "") + " " +
                                (report.cityISbb_agrix_countriesID_data ? report.cityISbb_agrix_countriesID_data.name : "")
                            }</td>
                            <td>{report.statusISLIST_Draft_Approved_Declined_Archived}</td>
                            <td style={{ textAlign: 'left'}}>
                                {
                                    report.statusISLIST_Draft_Approved_Declined_Archived === "Draft" &&
                                    <button 
                                        type="button" 
                                        className='icon-btn-primary mr-3'
                                        onClick={()=>onEdit(report)}
                                    >
                                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                    </button>
                                }
                                <button 
                                    type="button" 
                                    className='icon-btn-danger'
                                    onClick={()=>onDelete(report)}
                                >
                                    <i className="fa fa-ban" aria-hidden="true"></i>
                                </button>
                            </td>
                        </tr> 
                    )      
                })
            }
            </tbody>
        </Table>
    )
}

export default SellerReports;
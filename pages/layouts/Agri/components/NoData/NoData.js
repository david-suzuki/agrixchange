import React from 'react';

const NoData = ({ description, createLabel, onCreate }) => {

    return (
        <>
            <div className="no-data">
                <div className="content-wrapper">
                    <div className="container">
                        <div className="description">
                            {description}
                        </div>
                        <button className="btn btn-solid btn-default-plan btn-post" onClick={onCreate}>
                            {createLabel}
                        </button>
                    </div>
                </div>
            </div>

        </>
    )

}

export default NoData;
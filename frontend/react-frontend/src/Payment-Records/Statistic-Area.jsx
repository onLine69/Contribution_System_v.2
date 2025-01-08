export default function StatisticsArea({filteredStatus, contributions, choosenContribution, stat}) {    
    const contributionSelector = (
        <div id="contribution-info" className="card">
            <h3 className="card-title">Select Contribution</h3>
            <select name="selected-contribution" id="selected-contribution" className="filter-selection" onChange={(e) => { choosenContribution.fetchPayments(e.target.value) }}>
                {contributions.map((contribution, index) => {
                    return <option key={index} value={contribution.name}>{contribution.name}</option>;
                })}
            </select>

            <div className="stat-block">
                <div className="stat-block-label">Name:</div>
                <div className="stat-block-info" style={{color: "blue"}}>{choosenContribution.selectedContribution.name}</div>
            </div>
            <div className="stat-block">
                <div className="stat-block-label">Amount:</div>
                <div className="stat-block-info" style={{color: "green"}}>&#8369; {choosenContribution.selectedContribution.amount}</div>
            </div>
            <div className="stat-block">
                <div className="stat-block-label">Academic Year:</div>
                <div className="stat-block-info" style={{color: "red"}}>{choosenContribution.selectedContribution.academic_year}</div>
            </div>
        </div>
    );
    
    
    const statisticsRecords = (
        <div id="stat-records" className="card">
            <h3 className="card-title">Records Overview</h3>
            {
                filteredStatus !== "All" ? 
                (
                    <div className="stat-block">
                        <div className="stat-block-label">Shown Students:</div>
                        <div className="stat-block-info">{stat.payment_records_length}</div>
                    </div>
                ) : 
                (
                    <>
                    <div className="stat-block">
                        <div className="stat-block-label">Money Collected:</div>
                        <div className="stat-block-info" style={{color: "blue"}}>&#8369; {stat.paid * choosenContribution.selectedContribution.amount}</div>
                    </div>
                    <div className="stat-block">
                        <div className="stat-block-label">Paid Students:</div>
                        <div className="stat-block-info" style={{color: "green"}}>{stat.paid}</div>
                    </div>
                    <div className="stat-block">
                        <div className="stat-block-label">Unpaid Students:</div>
                        <div className="stat-block-info" style={{color: "red"}}>{stat.unpaid}</div>
                    </div>
                    <div className="stat-block">
                        <div className="stat-block-label">Shown Students:</div>
                        <div className="stat-block-info" style={{color: "black"}}>{stat.payment_records_length}</div>
                    </div>
                    </>
                )
            }
        </div>
    );
    
    return (
        <>
        {contributionSelector}
        {statisticsRecords}
        </>
    );
}
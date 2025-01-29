export default function StatisticsArea({contributions, choosenContribution, setters}) {   
    const contributionSelector = (
        <div id="contribution-info" className="card">
            <h3 className="card-title">Select Contribution</h3>
            <select name="selected-contribution" id="selected-contribution" className="filter-selection" onChange={(e) => { choosenContribution.fetchVerify(e.target.value, setters) }}>
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

    return (
        <>
        {contributionSelector}
        </>
    );
}
import "./WaterStatusCard.css";

function WaterStatusCard(props) {
    return (
        <div className="card">
            <h3>{props.locality}</h3>
            <p>Expected Time: {props.time}</p>
            <p>Status: {props.status}</p>
        </div>
    );
}

export default WaterStatusCard;
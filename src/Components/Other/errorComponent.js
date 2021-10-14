
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";


export function IsErrorFallback(){

    return <Card bg="dark" className="mb-3" style={{height: '500px'}}>
            <Card.Body>
            <h3 classname="text-center fade-in" style={{marginTop: 185, color: "orange", fontWeight: "bold"}}>!Something Went Wrong. Please Refresh! Please Report the Issue</h3>
            <Link to='https://github.com/cober2019/react-ios-xe-ops/issues'>Click Here to Submit Issue</Link>
            </Card.Body>
        </Card>
}
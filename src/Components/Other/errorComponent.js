
import Card from "react-bootstrap/Card";
import {Navigation} from "./navbarError";

export function IsErrorFallback(){

    return <Card bg="dark" className="mb-3" style={{height: '500px'}}>
            <Card.Body>
            <h4 class="text-center fade-in" style={{marginTop: 150}}>Error Collecting Data. I'll Keep Trying</h4>
                <div class="warning-loader text-center"></div>
            </Card.Body>
        </Card>
}
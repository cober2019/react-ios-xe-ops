
import Card from "react-bootstrap/Card";
import {Navigation} from "./navbarError";

export function IsErrorFallback(){

    return <Card bg="dark" className="mb-3" style={{height: '500px'}}>
            <Card.Body>
               <div class="warning-loader text-center" style={{marginTop: 175}}/>
            </Card.Body>
        </Card>
}

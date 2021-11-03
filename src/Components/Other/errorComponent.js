
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";


export function IsErrorFallback({error}){
    const reportError = String(error.message)
    return <Card bg="dark" className="mb-3" style={{height: '500px'}}>
            <Card.Body>
            <h3 classname="text-center fade-in" style={{marginTop: 185, color: "orange", fontWeight: "bold", textAlign: "center"}}>!Something Went Wrong. Please Refresh! Please Report the Issue</h3>
            <Col style={{textAlign: "center", fontSize: 20}}>
                <a href='https://github.com/cober2019/react-ios-xe-ops/issues'>Click Here to Submit Issue</a>
            </Col>
            <h5 className="mt-3" style={{textAlign: "center",  fontSize: 20}}>Report your current page/location in the app. Also a brief explanation on your task that errored</h5>
            <pre className="mt-3" style={{textAlign: "center",  fontSize: 20}}>{reportError}</pre>
            </Card.Body>
        </Card>
}
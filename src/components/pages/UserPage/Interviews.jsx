import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Header, Container, Segment, Grid, Dimmer, Loader, Button, Modal} from "semantic-ui-react";
import interviewApi from "../../../api/interview";
import employeeApi from "../../../api/employee";
import AcceptInterviewForm from "../../forms/AcceptInterviewForm";

class Interviews extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            interviews: [],
        }
    }

    componentDidMount = async () => {
        const {isHrManager, isCandidate} = this.props;

        if (isCandidate) {
            this.setState({interviews: await interviewApi.getUserInterviews(), loading: false})
        } else if (isHrManager) {
            const [interviews, teamLeads] = await Promise.all([interviewApi.getAllInterviews(), employeeApi.getAllTeamLeads()]);
            this.setState({interviews, teamLeads, loading: false})
        }
    };

    updateInterview = (interview) => {
        const interviews = this.state.interviews;

        interview[interviews.findIndex(x => x.id === interview.id)] = interview;

        this.setState(interview);
    };

    acceptInterview = async (interviewIndex, teamLeadIndex) => {
        const {interviews, teamLeads} = this.state;
        const interview = await interviewApi.acceptInterview(interviews[interviewIndex].id, teamLeads[teamLeadIndex].id);
        this.updateInterview(interview);
        this.acceptInterviewModalClose();
    };

    refuseInterview = async (interviewIndex) => {
        const interview = await interviewApi.refuseInterview(this.state.interviews[interviewIndex].id);
        this.updateInterview(interview);
    };

    acceptInterviewModalOpen = (e, {index}) => {
        const {interviews} = this.state;
        const interview = interviews[index];

        this.setState({
            addAcceptModalOpen: true,
            addAcceptModalData: {interviewIndex: index, ...interview},
        });
    };

    acceptInterviewModalClose = () => {
        this.setState({
            addAcceptModalOpen: false,
            addAcceptModalData: {},
        });
    };

    getAcceptInterviewModal = () => {
        const {addAcceptModalOpen, addAcceptModalData, teamLeads} = this.state;
        console.log(addAcceptModalData);
        const {time, date, candidate, interviewIndex} = addAcceptModalData;

        return (<Modal open={addAcceptModalOpen} size='small' dimmer='blurring'>
            <Modal.Header><Header as='h3' color='blue' content={"Time of interview: " + time + " Date of interview: " + date}/></Modal.Header>
            <Modal.Content>
                <AcceptInterviewForm teamLeads={teamLeads} interviewIndex={interviewIndex} submit={this.acceptInterview}/>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' secondary onClick={this.acceptInterviewModalClose}/>
            </Modal.Actions>
        </Modal>)
    };

    getInterviewsCards = () => {
        const {interviews} = this.state;
        const {isHrManager, isCandidate} = this.props;

        return interviews.map((interview, index) => {
            console.log(interview);
            const {time, candidate, date, status, opinion, teamLead} = interview;
            const {name: candidateName, surname: candidateSurname, email: candidateEmail, phone: candidatePhone} = candidate;

            const isPending = status === "PENDING";
            const isAccepted = status === "ACCEPTED";
            const isRefused = status === "REFUSED";
            const isCompleted = status === "COMPLETED";

            return (<Segment key={index}>
                <Grid divided stackable>
                    <Grid.Row columns={isHrManager ? 3 : 2}>
                        <Grid.Column textAlign='center'>
                            <p>Time: {time}</p>
                            <p>Date: {date}</p>
                            <p>Status: {status}</p>
                        </Grid.Column>

                        {isHrManager && <Grid.Column textAlign='center'>
                            <Header as='h3' content={"Candidate: " + candidateSurname + " " + candidateName}/>
                            <p>Email: {candidateEmail}</p>
                            <p>Phone: {candidatePhone}</p>
                        </Grid.Column>}

                        <Grid.Column textAlign='center'>
                            <Header as='h3'
                                    content={"Team Lead: " + (teamLead ? teamLead.surname + " " + teamLead.name : "Not assigned")}/>
                            {teamLead && <p>Email: {teamLead.LoginForm}</p>}
                            {teamLead && isHrManager && <p>Identifier: {teamLead.employeeIdentifier}</p>}
                        </Grid.Column>
                    </Grid.Row>

                    {isHrManager && isPending && <Grid.Row columns={2}>
                        <Grid.Column textAlign='center'>
                            <Button index={index} size='big' fluid primary content={"Accept"}
                                    onClick={this.acceptInterviewModalOpen}/>
                        </Grid.Column>

                        <Grid.Column>
                            <Button index={index} size='big' fluid primary content={"Refuse"}
                                    onClick={() => this.refuseInterview(index)}/>
                        </Grid.Column>
                    </Grid.Row>}
                </Grid>
            </Segment>);
        });
    };

    render() {
        const {interviews, loading, addAcceptModalOpen} = this.state;
        return (<div>
                {loading && <Dimmer active inverted><Loader size='massive'>Loading</Loader></Dimmer>}
                {addAcceptModalOpen && this.getAcceptInterviewModal()}
                <Container text>
                    {interviews.length > 0 && this.getInterviewsCards()}
                </Container>
            </div>
        );
    }
}

Interviews.propTypes = {
    user: PropTypes.shape(),
    isHrManager: PropTypes.bool.isRequired,
    isCandidate: PropTypes.bool.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    isHrManager: state.user.role === "HR_MANAGER",
    isCandidate: state.user.role === "CANDIDATE",
});

export default connect(mapStateToProps)(Interviews);

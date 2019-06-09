import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Header, Container, Segment, Grid, Dimmer, Loader, Button, Modal} from "semantic-ui-react";
import AddCvForm from "../../forms/AddCvForm"
import AddInterviewForm from "../../forms/AddInterviewForm"
import recruitmentApi from "../../../api/recruitment";
import interviewApi from "../../../api/interview";

class Recruitments extends Component {
    static propTypes = {};

    constructor(props) {
        super(props);

        this.state = {
            addCvModalOpen: false,
            addCvModalData: {
                recruitmentIndex: null,
            },
            addInterviewModalOpen: false,
            addInterviewModalData: {
                recruitmentIndex: null,
            },
            loading: true,
            recruitments: [],
        }
    }

    componentDidMount = async () => {
        const {isHrManager, isCandidate} = this.props;

        if (isCandidate) {
            this.setState({recruitments: await recruitmentApi.getUserRecruitments(), loading: false})
        } else if (isHrManager) {
            this.setState({recruitments: await recruitmentApi.getAllRecruitments(), loading: false})
        }
    };

    addCv = async (index, linkToCV) => {
        const recruitment = await recruitmentApi.addCv({id: this.state.recruitments[index].id, linkToCV});

        this.updateRecruitment(recruitment);
        this.addCvModalClose();
    };

    addInterview = async (index, dateAndTime) => {
        const recruitment = await interviewApi.createInterview(this.state.recruitments[index].id, dateAndTime);
        this.updateRecruitment(recruitment);
        this.addInterviewModalClose();

        this.props.history.push("/user#interview")
    };

    updateRecruitment = (recruitment) => {
        const recruitments = this.state.recruitments;

        recruitments[recruitments.findIndex(x => x.id === recruitment.id)] = recruitment;

        this.setState(recruitments);
    };

    acceptRecruitment = async (index) => {
        const recruitment = await recruitmentApi.acceptRecruitment(this.state.recruitments[index].id);
        this.updateRecruitment(recruitment);
    };

    refuseRecruitment = async (index) => {
        const recruitment = await recruitmentApi.refuseRecruitment(this.state.recruitments[index].id);
        this.updateRecruitment(recruitment);
    };

    addInterviewModalOpen = (e, {index}) => {
        const {recruitments} = this.state;
        const recruitment = recruitments[index];

        this.setState({
            addInterviewModalOpen: true,
            addInterviewModalData: {recruitmentIndex: index, ...recruitment},
        });
    };

    addInterviewModalClose = () => {
        this.setState({
            addInterviewModalOpen: false,
            addInterviewModalData: {},
        });
    };

    getAddInterviewModal = () => {
        const {addInterviewModalOpen, addInterviewModalData} = this.state;
        console.log(addInterviewModalData);
        const {jobOffer, recruitmentIndex} = addInterviewModalData;


        return (<Modal open={addInterviewModalOpen} size='small' dimmer='blurring'>
            <Modal.Header><Header as='h3' color='blue' content={`Job offer: ` + jobOffer.name}/></Modal.Header>
            <Modal.Content>
                <AddInterviewForm recruitmentIndex={recruitmentIndex} submit={this.addInterview}/>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' secondary onClick={this.addInterviewModalClose}/>
            </Modal.Actions>
        </Modal>)
    };

    addCvModalOpen = (e, {index}) => {
        const {recruitments} = this.state;
        const recruitment = recruitments[index];

        this.setState({
            addCvModalOpen: true,
            addCvModalData: {recruitmentIndex: index, ...recruitment},
        });
    };

    addCvModalClose = () => {
        this.setState({
            addCvModalOpen: false,
            addCvModalData: {},
        });
    };

    getAddCvModal = () => {
        const {addCvModalOpen, addCvModalData} = this.state;
        const {jobOffer, recruitmentIndex} = addCvModalData;

        return (<Modal open={addCvModalOpen} size='small' className='counteragentModal'
                       dimmer='blurring'>
            <Modal.Header><Header as='h3' color='blue' content={`Job offer: ` + jobOffer.name}/></Modal.Header>
            <Modal.Content>
                <AddCvForm recruitmentIndex={recruitmentIndex} submit={this.addCv}/>
            </Modal.Content>
            <Modal.Actions>
                <Button content='Cancel' secondary onClick={this.addCvModalClose}/>
            </Modal.Actions>
        </Modal>)
    };

    getRecruitmentsCards = () => {
        const {recruitments} = this.state;
        const {isHrManager, isCandidate} = this.props;

        return recruitments.map((recruitment, index) => {
            const {jobOffer, candidate, testResultPercent, status, hrManager, linkToCV} = recruitment;
            const {name: jobOfferName, position, description} = jobOffer;
            const {name: candidateName, surname, email, phone} = candidate;

            const isPending = status === "PENDING";
            const isAccepted = status === "ACCEPTED";
            const isRefused = status === "REFUSED";
            const isCompleted = status === "COMPLETED";

            return (<Segment key={index}>
                <Grid divided stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column textAlign='center'>
                            <Header as='h3' content={"Job offer: " + jobOfferName}/>
                            <p>Position: {position}</p>
                            <p>Status: {status}</p>
                            <p>Description: {description}</p>
                        </Grid.Column>

                        {isHrManager && <Grid.Column textAlign='center'>
                            <Header as='h3' content={"Candidate: " + surname + " " + candidateName}/>
                            <p>Email: {email}</p>
                            <p>Phone: {phone}</p>
                            <p>Tests result: {testResultPercent}%</p>
                            {linkToCV && <p>Link to CV: {linkToCV}</p>}
                        </Grid.Column>}

                        {isCandidate && hrManager && <Grid.Column textAlign='center'>
                            <Header as='h3'
                                    content={"HR Manager: " + (hrManager ? hrManager.surname + " " + hrManager.name : "Not assigned")}/>
                            <p>Email: {hrManager.LoginForm}</p>
                            <p>Phone: {hrManager.phone}</p>
                        </Grid.Column>}
                    </Grid.Row>

                    {isCandidate && isPending && !linkToCV && <Grid.Row columns={1}>
                        <Grid.Column textAlign='center'>
                            <Button index={index} size='big' fluid primary content={"Add CV"}
                                    onClick={this.addCvModalOpen}/>
                        </Grid.Column>
                    </Grid.Row>}

                    {isCandidate && isAccepted && <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Button index={index} size='big' fluid primary content={"Add interview"}
                                    onClick={this.addInterviewModalOpen}/>
                        </Grid.Column>
                    </Grid.Row>}

                    {isHrManager && isPending && <Grid.Row columns={2}>
                        <Grid.Column textAlign='center'>
                            <Button index={index} size='big' fluid primary content={"Accept"}
                                    onClick={() => this.acceptRecruitment(index)}/>
                        </Grid.Column>

                        <Grid.Column>
                            <Button index={index} size='big' fluid primary content={"Refuse"}
                                    onClick={() => this.refuseRecruitment(index)}/>
                        </Grid.Column>
                    </Grid.Row>}
                </Grid>
            </Segment>);
        });
    };

    render() {
        const {recruitments, addCvModalOpen, addInterviewModalOpen, loading} = this.state;
        return (<div>
                {loading && <Dimmer active inverted><Loader size='massive'>Loading</Loader></Dimmer>}
                {addCvModalOpen && this.getAddCvModal()}
                {addInterviewModalOpen && this.getAddInterviewModal()}
                <Container text>
                    {recruitments.length > 0 && this.getRecruitmentsCards()}
                </Container>
            </div>
        );
    }
}

Recruitments.propTypes = {
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

export default connect(mapStateToProps)(Recruitments);

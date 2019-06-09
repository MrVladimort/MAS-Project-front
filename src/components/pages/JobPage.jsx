import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Container, Dimmer, Form, Grid, Header, Loader, Modal, Segment} from "semantic-ui-react";
import {connect} from "react-redux";
import jobsApi from "../../api/jobs";

class JobPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jobs: [],
            jobModalOpen: false,
            jobModalData: {
                jobIndex: null,
                tests: []
            },
            loading: true,
            errors: {}
        }
    }

    applyJobOffer = async () => {
        const {id, tests} = this.state.jobModalData;
        const {history} = this.props;
        await jobsApi.applyForJobOffer(id, tests);
        history.push("/user#recruitment");
    };

    componentDidMount = async () => {
        const jobs = await jobsApi.getAllJobsOffers();
        this.setState({
            jobs,
            loading: false
        });
    };

    offerModalOpen = async (e, {index}) => {
        this.setState({loading: true});
        const {jobs} = this.state;
        const job = jobs[index];
        const tests = await jobsApi.getTests();

        this.setState({
            loading: false,
            jobModalOpen: true,
            jobModalData: {tests, jobIndex: index, ...job},
        });
    };

    offerModalClose = async () => {
        this.setState({
            jobModalOpen: false,
            jobModalData: {},
        });
    };

    getJobsCards = () => {
        const {jobs} = this.state;

        return jobs.map((job, index) => {
            const {name, position, description} = job;
            return (<Segment key={index}>
                <Grid divided stackable columns={2}>
                    <Grid.Column textAlign='center'>
                        <Header as='h3' content={name}/>
                        <p>Position: {position}</p>
                        <p>Description: {description}</p>
                    </Grid.Column>

                    <Grid.Column verticalAlign='middle'>
                        <Button index={index} size='big' fluid primary content='Apply for job offer'
                                onClick={this.offerModalOpen}/>
                    </Grid.Column>
                </Grid>
            </Segment>);
        });
    };

    getOfferModal = () => {
        const {isAuth} = this.props;
        const {jobModalData, jobModalOpen} = this.state;
        const {jobIndex, tests, id, name, position, description} = jobModalData;

        return (<Modal open={jobModalOpen} size='small' className='counteragentModal'
                       dimmer='blurring'>
            <Modal.Header><Header as='h3' color='blue' content={`Job offer: ` + name}/></Modal.Header>
            <Modal.Content>
                <Grid columns={1}>
                    <Grid.Row>
                        <Grid.Column>
                            <Form>
                                {tests.map((test, testIndex) => {
                                    return (<Form.Group>
                                            <label>{test.question}</label>
                                            {test.answers.map(answer =>
                                                <Form.Radio
                                                    label={answer}
                                                    checked={tests[testIndex].submittedAnswer === answer}
                                                    onChange={() => this.handleTestsChange(answer, testIndex)}
                                                />)}
                                        </Form.Group>
                                    )
                                })}
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                {isAuth && <Button content='Submit' primary onClick={this.applyJobOffer}/>}
                <Button content='Cancel' secondary onClick={this.offerModalClose}/>
            </Modal.Actions>
        </Modal>)
    };

    handleTestsChange = (answer, testIndex) => {
        const {jobModalData} = this.state;
        console.log(answer, testIndex);
        jobModalData.tests[testIndex].submittedAnswer = answer;
        console.log(jobModalData.tests);
        this.setState({jobModalData});
    };

    render() {
        const {jobs, loading, jobModalOpen} = this.state;
        return (
            <Grid stackable>
                {loading && <Dimmer active inverted><Loader size='massive'>Loading</Loader></Dimmer>}
                <Grid.Column>
                    <Container text>
                        {jobs.length > 0 && this.getJobsCards()}
                        {jobModalOpen && this.getOfferModal()}
                    </Container>
                </Grid.Column>
            </Grid>
        );
    }
}


History.propTypes = {
    user: PropTypes.shape(),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

const mapStateToProps = (state) => ({
    isAuth: !!state.auth.token,
    user: state.user
});

export default connect(mapStateToProps)(JobPage);

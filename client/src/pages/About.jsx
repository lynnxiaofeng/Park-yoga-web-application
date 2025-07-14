import { Mark, Text } from '@mantine/core';

const About = () => {
    return <>
        <h2>About</h2>
        <Text>This is a <Mark color="blue">Yoga Course Booking</Mark> application built using
            <br/>
            <br/>Backend:Node.js, Express, MongoDb (Mongoose)
            <br/>Frontend: React and Mantine
            <br/>
            <br/> 
        Developed by Xiaofeng Lin for IFN666 Web and Mobile Application Development at the Queensland University of Technology, Australia.
        </Text>
    </>;
};

export default About;

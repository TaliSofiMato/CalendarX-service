import { v1 } from 'uuid'
import { DynamoDB } from 'aws-sdk'

export const createEvent = async (e) => {
    const cognitoUser = e.requestContext?.authorizer?.jwt?.claims?.username
    let data = JSON.parse(e.body)
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            pk: `EVENT#${cognitoUser}`,
            sk: v1(),
            data: data
        }
    };
    try {
        await dynamoDb.put(params).promise();
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: e.message,
        };  
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Event created successfully.' }),
    };
};
export const createEventType = async (e) => {
    const cognitoUser = e.requestContext?.authorizer?.jwt?.claims?.username
    const data = JSON.parse(e.body)
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            pk: `EVENTTYPE#${cognitoUser}`,
            sk: v1(),
            data: data
        }
    };
    try {
        await dynamoDb.put(params).promise();
    } catch (error) {
        console.error(error); // eslint-disable-line
        throw error;
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Event Type created successfully.' }),
    };
};

export const getEvents = async (e, b) => {
    const cognitoUser = e.requestContext?.authorizer?.jwt?.claims?.username
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression   : "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": `EVENT#${cognitoUser}`
        }
    };
    let events;
    try {
        events = await dynamoDb.query(params).promise();
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: e.message,
        };  
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(events.Items),
    };
};

export const getEventTypes = async (e) => {
    const cognitoUser = e.requestContext?.authorizer?.jwt?.claims?.username
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression   : "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": `EVENTTYPE#${cognitoUser}`
        }
    };
    let eventTypes;
    try {
        eventTypes = await dynamoDb.query(params).promise();
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: e.message,
        };  
    }    

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(eventTypes.Items),
    };    
};

export const getEvent = async (id) => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        KeyConditionExpression   : "#pk = :pk and #sk = :sk",
        ExpressionAttributeNames: {
            "#pk": 'pk',
            "#sk": 'sk'
        },
        ExpressionAttributeValues: {
          ":pk": 'EVENT',
          ":sk": id
        },
    };
    let event;
    try {
        event = await dynamoDb.query(params).promise();
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: e.message,
        };  
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(event.Items),
    };    
};
export const getEventType = async (id) => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            pk: 'EVENT-TYPE',
            sk: id
        }
    };
    let eventType;
    try {
        eventType = await dynamoDb.query(params).promise();
    } catch (e) {
        return 'error!';
    }
    return eventType.Items;
};
export const putEvent = async (data) => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            pk: 'Event',
            createdAt: timestamp,
        },
    };
    try {
        await dynamoDb.put(params).promise();
    } catch (error) {
        console.error(error); // eslint-disable-line
        throw error;
    }
};
export const putEventType = async (data) => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const timestamp = new Date().getTime();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            pk: 'EventType',
            createdAt: timestamp,
        },
    };
    try {
        await dynamoDb.put(params).promise();
    } catch (error) {
        console.error(error); // eslint-disable-line
        throw error;
    }
};
export const deleteEvent = async (awsEvent) => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            pk: 'EVENT',
            sk: awsEvent.pathParameters.id
        },
    };
    try {
        await dynamoDb.delete(params).promise();
    } catch (e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: e.message,
        };  
    } 
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Event deleted successfully.' }),
    };   
};
export const deleteEventType = async (awsEvent) => {
    const dynamoDb = new DynamoDB.DocumentClient();
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            pk: 'EVENT-TYPE',
            sk: awsEvent.pathParameters.id
        },
    };
    try {
        await dynamoDb.delete(params).promise();
    } catch (e) {
        console.log('error!', e); // eslint-disable-line
    }
};

const express = require('express');
const bodyParser = require('body-parser');
const graphQlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Job = require('./models/job');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphQlHttp({
  schema: buildSchema(`
    type Job {
      _id: ID!
      name: String!
      description: String!
      date: String!
    }

    input JobInput {
      name: String!
      description: String!
      date: String!
    }

    type RootQuery {
      jobs: [Job!]!
    }

    type RootMutation {
      createJob(jobInput: JobInput): Job
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    jobs: () => {
      return Job.find()
        .then((jobs) => {
          return jobs.map(job => ({
            ...job._doc
          }));
        }).catch((err) => {
          throw err;
        });
    },
    createJob: (args) => {
      const job = new Job({
        name: args.jobInput.name,
        description: args.jobInput.description,
        date: new Date(args.jobInput.date),
      });
      return job.save().then((result) => {
        return { ...result._doc }
      }).catch((err) => {
        throw err
      });
    }
  },
  graphiql: true,
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-5uzdz.mongodb.net/jobConnect?retryWrites=true&w=majority`)
  .then(() => {
    app.listen(3000);
  }).catch((err) => {
    console.log(err);
  })

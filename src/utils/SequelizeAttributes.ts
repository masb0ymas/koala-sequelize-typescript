import sequelize from 'sequelize'

const { MockQueryInterface, read } = require('./ReaderMigrationSequelize')

const newMockQueryInterface = new MockQueryInterface()

read(sequelize, newMockQueryInterface, 'src/migrations')

const SequelizeAttributes = newMockQueryInterface.attributeTables

export default SequelizeAttributes

const cors = require('cors')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')

/** @param { import('express').Express} app */
module.exports = app => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use(compression())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
}
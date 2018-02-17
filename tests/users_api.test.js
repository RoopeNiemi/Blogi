
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User=require('../models/user')
const {
  format,
  initialBlogs,
  nonExistingId,
  usersInDb
} = require('./test_helper')



describe.only('when there is initially one user at database',async()=>{
    beforeAll(async()=>{
        await User.remove({})
        const user=new User({username:'root',password:'salasana'})
        await user.save()
    })

    test('POST /api/users succeeds with a fresh username',async()=>{
        const usersBefore=await usersInDb()

        const newUser={
            username:'rniemi',
            name:'Roope Niemi',
            adult:true,
            password:'salasanasalasana'
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type',/application\/json/)

        const usersAfter=await usersInDb()
        expect(usersAfter.length).toBe(usersBefore.length+1)
        const usernames=usersAfter.map(u=>u.username)
        const found=usersAfter.find(u=>u.username===newUser.username)
        console.log(found.passwordHash)
        expect(usernames).toContain(newUser.username)
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
        const usersBeforeOperation = await usersInDb()
      
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen'
        }
      
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
      
        expect(result.body).toEqual({ error: 'username must be unique'})
      
        const usersAfterOperation = await usersInDb()
        expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
      })

      test('POST /api/users fails when password is less than 3 characters', async()=>{
        const usersBeforeOperation = await usersInDb()
      
        const newUser = {
          username: 'test',
          name: 'Superuser',
          password: 'is',
          adult:true
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
      expect(result.body).toEqual({ error: 'password must be atleast 3 characters long'})
        
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
      })

      test('POST /api/users sets adult:true when it is undefined', async()=>{
        const usersBeforeOperation = await usersInDb()
      
        const newUser = {
          username: 'testi',
          name: 'Superuser',
          password: 'island'
        }

         await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      const addedUser=await usersAfterOperation.find(u=>u.username==='testi')
      expect(addedUser.adult).toEqual(true)
      })
    })
    afterAll(() => {
        server.close
      })

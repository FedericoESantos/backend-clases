import UsuarioManager from "../../src/dao/UsuarioManager.js";
import Assert from "assert";
import { describe, it } from "mocha";
import { Singleton } from "../../src/dao/singleton.js";
import mongoose from "mongoose";

const assert = Assert.strict;

Singleton.conectar("mongodb+srv://boomarts47:fede123@cluster0.z3tu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", "E-Commerce");

describe("Pruebas Dao Usuarios", function(){
    this.timeout(10000);

    before(async function(){
        this.dao = new UsuarioManager();
        mongoose.connection.collection("usuarios").deleteMany({email:"test@test.com"})
    });

    afterEach(async function(){
        this.dao = new UsuarioManager();
        mongoose.connection.collection("usuarios").deleteMany({email:"test@test.com"})
    });


    it("El Dao con su metodo GET retorna un array de usuarios", async function(){
        let resultado = await this.dao.getUsuarios();
        
        assert.equal(Array.isArray(resultado), true);
        if(Array.isArray(resultado) && resultado.length>0){
            assert.ok(resultado[0]);
            assert.ok(resultado[0].email);
        }
    })

    it("El dao en su metodo SAVE crea un usuario en la base de datos", async function(){
        let mockUsuario = {name:"test", last_name:"test", email:"test@test.com", password: "123"}
        let resultado = await this.dao.addUsuario(mockUsuario);
        console.log(resultado);
    })



});



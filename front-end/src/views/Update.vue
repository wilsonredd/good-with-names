<template>
<div class="update">
    <h1>Update Your Information</h1>

    <div class="form" v-if="loggedIn && updating">
        <div class="input">
            <p>Name:</p>
            <input v-model="name" placeholder="Jane Smith">
        </div>
        <div class="input">
            <p>Age:</p>
            <input v-model="age" placeholder="22">
        </div>
        <div class="input">
            <p>Interest/Hobbie:</p>
            <input v-model="interest" placeholder="Drone Racing">
        </div>
        <div class="input">
            <p>Where You Met Yourself:</p>
            <input v-model="where" placeholder="California">
        </div>
        <div class="input">
            <p>Defining Physical Feature:</p>
            <input v-model="physical" placeholder="Deep blue eyes">
        </div>
        <div class="file-upload">
            <p>Upload A Photo of Yourself:</p>
            <input type="file" name="photo" @change="fileChanged">
        </div>
        <button type="button" class="updateInfoButton" @click="updateInfo">Update Information</button>
    </div>
    <div @click="toggleForm" v-if="!updating">
        <h2>Your Current Information</h2>
        <img class="personal-image" :src="info.path" alt="">
        <h2>{{info.name}}</h2>
        <p>Age: {{info.age}}</p>
        <p>Interest: {{info.interest}}</p>
        <p>Where I Met Them: {{info.where}}</p>
        <p>Physical Quality: {{info.definingPhysicalFeature}}</p>
        <p class="show-form" @click="toggleForm">Click Here To Change Something Else</p>
    </div>
    <p class="show-info" @click="toggleForm" v-if="loggedIn && updating">Click Here To See Your Current Information</p>
    <p class="error" v-if="!loggedIn">Please Log In So You Can Update Your Info</p>
</div>


        <!-- <div class="form" v-if="loggedIn && updating">
            <input v-model="name" placeholder="Name">
            <p></p>
            <input v-model="age" placeholder="Age">
            <p></p>
            <input v-model="interest" placeholder="Interest/Hobbie">
            <p></p>
            <input v-model="where" placeholder="Where Did You Meet Yourself?">
            <p></p>
            <input v-model="physical" placeholder="Defining Physical Feature">
            <p></p>
            <div class="file-upload">
                <input type="file" name="photo" @change="fileChanged">
                <button @click="updateInfo">Update Information</button>
            </div>
        </div> -->

</template>

<script>
import axios from 'axios';
export default {
    name: 'Update',
    data() {
        return {
            name: "",
            age: "",
            interest: "",
            where: "",
            physical: "",
            file: null,
            updating: true,
            info: "Info",
        }
    },
    computed: {
        loggedIn() {
            return this.$root.$data.loggedIn;
        }
    },
    mounted() {
        if (this.$root.$data.user !== null){
            this.getInfo();
        }
    },
    methods: {
        fileChanged(event) {
            this.file = event.target.files[0]
        },
        async updateInfo() {
            try{
                let path = "";
                if(this.file !== null) {
                    const formData = new FormData();
                    formData.append('photo', this.file, this.file.name);
                    let r1 = await axios.post('/api/photos', formData);
                    path = r1.data.path
                }
                let r2 = await axios.put('/api/person/' + this.$root.$data.user._id, {
                    name: this.name,
                    age: this.age,
                    interest: this.interest,
                    where: this.where,
                    physical: this.physical,
                    path: path
                });
                console.log(r2.data);
                this.getInfo();
                this.name = "";
                this.age = "";
                this.interest = "";
                this.where = "";
                this.physical = "";
                this.file = null,
                this.toggleForm();
        } catch (error) {
                console.log(error);
        }
        },
        async getInfo() {
            let r1 = await axios.get('/api/info/' + this.$root.$data.user._id);
            this.info = r1.data;
        },
        toggleForm() {
            this.updating = !this.updating;
        }
    }
}
</script>

<style scoped>
    .update {
        min-height: 75vh;
    }

    .error {
        margin: 50px 0px 75vh 0px;
        padding: 0px 5px 0px 5px;
        text-align: center;
        color: #FF0000;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .input {
        display: flex;
        flex-direction: column;
        margin: 5px;
        width: 250px;
    }

    .file-upload {
        display: flex;
        flex-direction: column;
        margin: 5px;
        width: 250px;
    }

    .file-upload>p {
        text-align: left;
    }

    .input>p{
        text-align: left;
    }

    .updateInfoButton {
        margin: 5px;
    }

    .show-info {
        margin: 5px;
        font-weight: bold;
    }

    .show-form {
        margin: 5px;
        font-weight: bold;
    }

    .personal-image {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px;
        width: 250px;
    }
</style>
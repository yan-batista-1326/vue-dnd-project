<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <h1>User Crud</h1>
            </v-col>
        </v-row>
    </v-container>
</template>

export default {
    name: "UserCrud",
    data() => ({
        users: [
            {id: 1, name: 'José', location: 'Rio de Janeiro'},
            {id: 2, name: 'Fulano', location: 'São Paulo'},
        ]
    });
}
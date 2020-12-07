<template>
    <v-data-table :headers="headers" :items="magias" sort-by="level">

        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>My CRUD</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on"> Nova Magia </v-btn>
                    </template>

                    <v-card>
                        <v-card-title> <span class="headline">{{ formTitle }}</span> </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.id" label="ID*" required type="number"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.level" label="Level*" hint="Level da magia" required type="number" max="9" min="0"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.area" label="Área*" hint="Tamanho da área de efeito da magia" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="editedItem.nome" label="Nome*" hint="Nome da Magia" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="editedItem.atkSv" label="Ataque ou Salvamento*" type="text" required hint="Tipo de ataque ou salvamento da magia"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="editedItem.dmgEff" label="Dano ou Efeito*" type="text" required hint="Tipo de dano ou efeito da magia"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close"> Fechar </v-btn>
                            <v-btn color="blue darken-1" text @click="save"> Salvar </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                

                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Tem certeza que deseja apagar esse item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Não</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-toolbar>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="inicializa"> Reset </v-btn>
        </template>
    </v-data-table>
</template>

<script>
import axios from "axios";

export default {
    name: "Magias",
    data () {
        return {
            dialog: false,
            dialogDelete: false,
            headers: [
                {text: "Level", value: "level"},
                {text: "Nome", value: "nome"},
                {text: "Área (m)", value: "area"},
                {text: "Ataque/Salvamento", value: "atkSv"},
                {text: "Dano/Efeito", value: "dmgEff"},
                {text: "Ações", value: "actions", sortable: false}
            ],
            magias: [], //Pega do Banco de dados a partir do método Inicializa
            editedIndex: -1,
            editedItem: {
                id: 0,
                level: 0,
                nome: "",
                area: "",
                atkSv: "",
                dmgEff: "",
            },
            defaultItem: {
                id: 0,
                level: 0,
                nome: "",
                area: "",
                atkSv: "",
                dmgEff: "",
            },
        } 
    },
    methods: {
        inicializa() {
            axios("http://localhost:3000/magias")
            .then((response) => {
                this.magias = response.data;
            })
            .catch((error) => console.log(error))
        },
        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },
        save() {
            if (this.editedIndex > -1) { //alteração
                axios.put("http://localhost:3000/magias/" + this.editedItem.id, this.editedItem)
                .then(response => {
                    console.log(response);
                    Object.assign(this.magias[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            } else {
                axios.post("http://localhost:3000/magias", this.editedItem)
                .then(response => {
                    console.log(response);
                    this.magias.push(this.editedItem);
                    this.close();
                })
                .catch(error => console.log(error));
            }
        },
        editItem(item) {
            this.editedIndex = this.magias.indexOf(item);
            console.log(this.editedIndex);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        deleteItem(item) {
            this.editedIndex = item.id
            this.editedItem = Object.assign({}, item)
            console.log(this.editedIndex);
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            axios.delete("http://localhost:3000/magias/" + this.editedIndex)
            .then(response => {
                console.log(response.data);
                this.magias.splice(this.editedIndex, 1);
            })
            .catch(error => console.log(error));
            this.closeDelete();
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
    },
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Novo Item" : "Editar Item"
        }
    },
    created() {
        this.inicializa();
    }
}
</script>
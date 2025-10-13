<template>
    <v-container>
        <div class="login">
            <h1>{{ $t("password-recover") }}</h1>
            <p>{{ $t("password-recover-text") }}</p>
            <Form v-slot="{ meta, errors }">
                <v-row no-gutters>
                    <v-col>
                        <Field name="email" rules="required|email">
                            <template #default="{ field }">
                                <v-text-field color="primary" v-bind="field" v-model="field.value"
                                    :error-messages="errors.email ? [errors.email] : []" :label="$t('email')"
                                    variant="outlined" clearable :prepend-inner-icon="'mdi-email'" />
                            </template>
                        </Field>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col cols="2" class="text-right mt-10 pt-10">
                        <v-btn color="#E6E6E6" elevation="0" block :to="{ name: 'UserLogin' }">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="1" class="text-right mt-10 pt-10"> </v-col>
                    <v-col class="text-right mt-10 pt-10">
                        <v-btn color="primary" type="submit" :disabled="!meta.valid" elevation="0" block>
                            {{ $t("submit") }}
                        </v-btn>
                    </v-col>
                </v-row>
            </Form>
        </div>
    </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Form, Field, useForm } from 'vee-validate';

export default defineComponent({
    components: {
        Form,
        Field,
    },
    setup() {
        const { handleSubmit } = useForm();

        const submitForm = handleSubmit(async (values) => {
            
        });

        return {
            submitForm,
        };
    },
});
</script>


<style scoped lang="scss">
.v-container {
    display: flex;
    min-height: 100vh;
    justify-content: center;
    align-items: center;

    .login {
        width: 342px;

        h1 {
            color: #1d3557;
            font-weight: 900;
            font-size: 39px;
            line-height: 120%;
        }

        p {
            margin-bottom: 10px;
        }
    }
}
</style>
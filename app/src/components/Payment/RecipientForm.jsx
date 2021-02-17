import React, { useState, useEffect } from 'react';
import useForm from 'react-hook-form';
import IBAN from 'iban';
import EmailValidator from 'email-validator';
import styled from "styled-components";

import { Box } from '@material-ui/core';
import { Button, IconArrowRight } from '@aragon/ui';

import FormField from './FormField';
import { FieldError } from '../UI/StyledComponents';
import CountrySelect from "../UI/CountrySelect";

const fields = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  iban: {
    required: true,
    minLength: 14,
    maxLength: 34,
    validate: IBAN.isValid,
  },
  address: {
    minLength: 2,
    maxLength: 50,
    required: true,
  },
  zip: {
    required: true,
    minLength: 2,
    maxLength: 10,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  country: {
    required: true,
    minLength: 2,
    maxLength: 2,
  },
  bic_swift: {
    minLength: 8,
    maxLength: 11,
    pattern: /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3}){0,1}$/,
  },
  email: {
    validate: value => !value || value === '' || EmailValidator.validate(value),
  },
};

const errorMessages = {
  iban: 'Invalid IBAN',
  bic_swift: 'Invalid BIC',
  email: 'Invalid email',
  'owner.name': 'Invalid name',
  'owner.address': 'Invalid address',
  'owner.zip': 'Invalid Zip/Code',
  'owner.city': 'Invalid city',
  'owner.country': 'Invalid country',
};

const Section = styled.p`
  text-align: center;
  color: ${props => props.theme.contentSecondary};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.8rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const defaultEndComponent = ({ submit, hasErrors }) => (
  <Button mode="strong" onClick={submit} wide icon={<IconArrowRight/>} label="Save recipient" disabled={hasErrors} />
);

function RecipientForm({ initialRecipient, onSubmit, endComponent = defaultEndComponent }) {
  // const [more, setMore] = useState(false);

  const { register, handleSubmit, errors, setValue, reset } = useForm({
    mode: 'onChange',
    defaultValues: initialRecipient || undefined,
  });
  useEffect(() => {
    reset(initialRecipient);
  }, [reset, initialRecipient]);
  const submit = handleSubmit(onSubmit);

  const [selectedCountryCode, setSelectedCountryCode] = useState(
    initialRecipient?.owner?.country
  );
  function setCountry(countryCode) {
    setSelectedCountryCode(countryCode);
    setValue('owner.country', countryCode);
  }
  useEffect(() => {
    register({ name: 'owner.country' }, fields.country);
    setValue('owner.country', initialRecipient?.owner?.country || '');
  }, [register, initialRecipient, setValue]);

  const hasErrors = Object.keys(errors).length !== 0;

  return (
    <form onSubmit={submit}>

      <Section>Bank account</Section>

      <FormField label="IBAN" name="iban" ref={register(fields.iban)} errors={errors} errorMessages={errorMessages} required />

      <Section>Personal informations</Section>

      <FormField label="Full Name" name="owner.name" ref={register(fields.name)} errors={errors} errorMessages={errorMessages} required />
      <FormField label="Address" name="owner.address" ref={register(fields.address)} errors={errors} errorMessages={errorMessages} required />
      <FormField label="Zip/Postal code" name="owner.zip" ref={register(fields.zip)} errors={errors} errorMessages={errorMessages} required />
      <FormField label="City" name="owner.city" ref={register(fields.city)} errors={errors} errorMessages={errorMessages} required />

      <FormField label="Country" name="owner.country" errors={errors} errorMessages={errorMessages} required >
        <CountrySelect
          countryCode={selectedCountryCode}
          onChange={setCountry}
          data-private
        />
      </FormField>

      <Box mb={2}>
        <FieldError>{
          Object.keys(errors)
            .filter(s => s !== 'owner.name' && s !== "iban")
            .map(errorField =>
              errorMessages[errorField]
            )
            .join(', ')
        }
        </FieldError>
      </Box>

      {/*<Box mb={2} mt={1}>
        <Link onClick={() => setMore(!more)}>
          {more ? 'Show less' : 'Show more'}
        </Link>
      </Box>*/}

      {/*<Box display={more ? 'block' : 'none'}>
        <FormField label="BIC/SWIFT" name="bic_swift" ref={register(fields.bic_swift)} errors={errors} errorMessages={errorMessages} />
        <FormField label="Email" name="email" ref={register(fields.email)} errors={errors} errorMessages={errorMessages} />
      </Box>*/}

      {endComponent({ submit, hasErrors })}
    </form>
  )
}

export default RecipientForm;


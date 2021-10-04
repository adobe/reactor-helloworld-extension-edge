/*
Copyright 2021 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

const byteArrayToString = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

module.exports = ({
  arc: { ruleStash = {} },
  utils: { fetch, getSettings, getExtensionSettings, logger },
}) => {
  const { url } = getExtensionSettings();
  const { responseKey, bodyFn } = getSettings();

  const fetchOptions = {
    method: 'POST',
  };

  if (bodyFn) {
    fetchOptions.body = JSON.stringify(bodyFn());
  }

  return fetch(url, fetchOptions).then((r) => {
    const accRuleStash = ruleStash['hello-world'] || {
      responses: {},
    };

    if (responseKey) {
      return r
        .arrayBuffer()
        .then(byteArrayToString)
        .then((bodyResponse) => {
          accRuleStash.responses[responseKey] = bodyResponse;
          return accRuleStash;
        });
    }

    return accRuleStash;
  });
};


export function queryContacts(name)
{
  
}


function onCreate(values)
{
    console.log(values)
}

export function onCancel(setShow)
{
  setShow(false)
}

export function onOk(form, setShow)
{
    form
    .validateFields()
    .then(values => {
      form.resetFields();
      onCreate(values);
      setShow(false)
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
}

export function initialValues()
{
    return {}
}


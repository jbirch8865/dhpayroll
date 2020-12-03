
export const filters = (data) => {
  return [
    ...new Map(
      data
        .map((person) =>
          person.has_skills.map((skill) => {
            return { text: skill.skill.Name, value: skill.skill.Name };
          })
        )
        .flat()
        .map((skill) => [skill["text"], skill])
    ).values(),
  ]}

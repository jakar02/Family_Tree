package com.example.FamilyTree.service;

import com.example.FamilyTree.model.Person;
import com.example.FamilyTree.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PersonService {

    private final PersonRepository personRepository;

    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person createPerson(Person person, boolean isRoot) {
        person.setRoot(isRoot);
        return personRepository.save(person);
    }


    public Optional<Person> findPersonById(UUID id) {
        return personRepository.findById(id);
    }

    public List<Person> getAll() {
        return personRepository.findAll();
    }


    public void addChild(UUID parentId, Person child) {
        Optional<Person> parent = personRepository.findById(parentId);
        if (parent.isPresent()) {
            Person childSaved = personRepository.save(child);
            parent.get().getChildren().add(childSaved);
            personRepository.save(parent.get());
        }
    }

    public void addPartner(UUID personId, Person partner) {
        Optional<Person> person = personRepository.findById(personId);
        if (person.isPresent()) {
            Person partnerSaved = personRepository.save(partner);
            person.get().setPartners(partnerSaved);
            personRepository.save(person.get());
        }
    }

    public void createFamilyTree(Person rootPerson) {
        rootPerson.setRoot(true);
        Person savedRootPerson = personRepository.save(rootPerson);
    }

    public void updateFamilyTree(Person rootPerson) {
        Person existingPerson = personRepository.findById(rootPerson.getId())
                .orElseThrow(() -> new RuntimeException("Person not found"));
        existingPerson.setName(rootPerson.getName());
        existingPerson.setSurname(rootPerson.getSurname());
        existingPerson.setPartners(rootPerson.getPartners());
        existingPerson.setChildren(rootPerson.getChildren());
        existingPerson.setBirthYear(rootPerson.getBirthYear());
        existingPerson.setDeathYear(rootPerson.getDeathYear());
        personRepository.save(existingPerson);
    }
}

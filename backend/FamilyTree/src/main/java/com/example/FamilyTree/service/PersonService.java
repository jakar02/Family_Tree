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
            Person partnerSaved = personRepository.save(partner); // Zapisz partnera, jeśli to nowa osoba
            person.get().getPartners().add(partnerSaved); // Dodaj do listy partnerów
            personRepository.save(person.get()); // Zapisz główną osobę z nowym partnerem
        }
    }

    // Metoda do tworzenia całego drzewa genealogicznego
    public Person createFamilyTree(Person rootPerson) {
        // Zapisujemy założyciela (root) drzewa genealogicznego
        rootPerson.setRoot(true);
        Person savedRootPerson = personRepository.save(rootPerson);

        // Zapisujemy partnerów i dzieci założyciela
        savePartnersAndChildren(savedRootPerson);

        return savedRootPerson;
    }

    // Metoda do zapisania partnerów i dzieci
    private void savePartnersAndChildren(Person person) {
        // Zapisujemy partnerów
        for (Person partner : person.getPartners()) {
            personRepository.save(partner);
        }

        // Zapisujemy dzieci
        for (Person child : person.getChildren()) {
            personRepository.save(child);
        }

        // Rekursywnie zapisujemy partnerów i dzieci dla każdego z nich
        for (Person partner : person.getPartners()) {
            savePartnersAndChildren(partner);
        }
        for (Person child : person.getChildren()) {
            savePartnersAndChildren(child);
        }
    }
}

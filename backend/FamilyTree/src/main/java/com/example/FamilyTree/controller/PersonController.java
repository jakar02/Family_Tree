package com.example.FamilyTree.controller;

import com.example.FamilyTree.model.Person;
import com.example.FamilyTree.service.PersonService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/persons")
//@CrossOrigin(origins = "http://localhost:5173")
public class PersonController {

    @RequestMapping(value = "/{path:^(?!api).*$}")
    public String serveFrontend() {
        return "forward:/index.html";
    }

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping
    public Person createPerson(@RequestBody Person person) {
        return personService.createPerson(person, true);
    }

    @GetMapping("/root-persons")
    public List<Person> getRootPersons() {
        List<Person> persons = personService.getAll();
        List<Person> rootPersonsWithFamily = new ArrayList<>();
        for (Person person : persons) {
            if(person.isRoot()){
                rootPersonsWithFamily.add(person);
            }
        }
        return rootPersonsWithFamily;
    }

    @GetMapping("/{id}")
    public Optional<Person> getPerson(@PathVariable UUID id) {
        return personService.findPersonById(id);
    }

    @PostMapping("/{id}/add-partner")
    public void addPartner(@PathVariable UUID id, @RequestBody Person partner) {
        personService.addPartner(id, partner);
    }

    @PostMapping("/{id}/add-child")
    public void addChild(@PathVariable UUID id, @RequestBody Person child) {
        personService.addChild(id, child);
    }

    @PostMapping("/add-family-tree")
    public void addFamilyTree(@RequestBody Person rootPerson) {
        personService.createFamilyTree(rootPerson);
    }

    @PostMapping("/edit-family-tree")
    public void editFamilyTree(@RequestBody Person rootPerson) {
        personService.updateFamilyTree(rootPerson);
    }
}

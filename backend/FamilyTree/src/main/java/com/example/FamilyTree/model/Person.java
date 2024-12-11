package com.example.FamilyTree.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Node("Person")  // Węzeł w grafie Neo4j
public class Person {

    @Id
    @GeneratedValue
    private UUID id;  // Zmieniono z Long na UUID

    @JsonProperty("name")
    private String name = "";

    @JsonProperty("surname")
    private String surname = "";

//    @Version
//    private Long version;

    @Relationship(type = "HAS_CHILD", direction = Relationship.Direction.OUTGOING)
    private List<Person> children = new ArrayList<>();

    @Relationship(type = "PARTNER")
    private Person partners;

    private boolean isRoot = false;

    private String treeName = "";

    private int birthYear=0;

    private int deathYear=0;

    public String getTreeName() {
        return treeName;
    }

    public void setTreeName(String treeName) {
        this.treeName = treeName;
    }

    public boolean isRoot() {
        return isRoot;
    }

    public void setRoot(boolean root) {
        isRoot = root;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public List<Person> getChildren() {
        return children;
    }

    public void setChildren(List<Person> children) {
        this.children = children;
    }

    public Person getPartners() {
        return partners;
    }

    public void setPartners(Person partners) {
        this.partners = partners;
    }

    public int getBirthYear() {
        return birthYear;
    }

    public void setBirthYear(int year) {
        this.birthYear = year;
    }

    public int getDeathYear() {
        return deathYear;
    }

    public void setDeathYear(int year) {
        this.deathYear = year;
    }
}

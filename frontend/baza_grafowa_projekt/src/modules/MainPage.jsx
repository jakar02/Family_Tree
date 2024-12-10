import "/src/styles/MainPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import ikony plusa
import EditIcon from "@mui/icons-material/Edit";

function MainPage() {
  const [updating, setUpdating] = useState(false);
  const [familyTrees, setFamilyTrees] = useState([]);
  const [selectedTree, setSelectedTree] = useState(null);
  const [editingTree, setEditingTree] = useState(null); // Stan dla nowego drzewa
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [founderAdded, setFounderAdded] = useState(false);
  const [ifSaveFamily, setIfSaveFamily] = useState(false);
  const [expandedNode, setExpandedNode] = useState(null); // Jeden rozwinięty węzeł

  const handleExpandNode = (personId) => {
    setExpandedNode(expandedNode === personId ? null : personId); // Tylko jeden węzeł może być rozwinięty
  };

  const handleTreeSelect = (tree) => {
    setSelectedTree(tree);
    setEditingTree(null); // Wyłącz edycję nowego drzewa
  };

  const handleAddFamilyTree = () => {
    const newTree = {
      treeName: "New Family Tree",
      name: "",
      surname: "",
      partners: null,
      children: [],
      birthYear: "",
      deathYear: "",
    };
    setEditingTree(newTree);
    setUpdating(false);
    setFounderAdded(false);
  };

  // Funkcja do dodania nowego członka do drzewa
  const handleAddPartner = (parent) => {
    if (name.trim()) {
      if (parent.partners == null) {
        parent.partners = {
          name: name,
          surname: surname,
          partners: null,
          children: [],
          birthYear: birthYear,
          deathYear: deathYear,
        };
      }

      const updatedTree = { ...editingTree };

      setEditingTree(updatedTree);
      setName(""); // Reset pola
      setSurname(""); // Reset pola
      setBirthYear("");
      setDeathYear("");
      setExpandedNode(null); // Zwijanie po dodaniu
    }
  };

  const handleAddChild = (parent) => {
    if (name.trim()) {
      const updatedTree = { ...editingTree };
      parent.children.push({
        name: name,
        surname: surname,
        partners: null,
        children: [],
        birthYear: birthYear,
        deathYear: deathYear,
      });
      setEditingTree(updatedTree);
      setName(""); // Reset pola
      setSurname(""); // Reset pola
      setBirthYear("");
      setDeathYear("");
      setExpandedNode(null); // Zwijanie po dodaniu
    }
  };

  // Funkcja do zapisywania drzewa genealogicznego
  const handleSaveFamilyTree = async () => {
    setUpdating(false);
    console.log("Zapisywanie drzewa genealogicznego:", editingTree);
    if (!editingTree.name || !editingTree.surname) {
      alert("Podaj imię i nazwisko założyciela drzewa!");
      return;
    }

    try {
      // Wykonanie żądania POST do API, aby zapisać drzewo genealogiczne
      const response = await axios.post(
        "http://localhost:8080/api/persons/add-family-tree",
        {
          treeName: editingTree.treeName,
          name: editingTree.name,
          surname: editingTree.surname,
          partners: editingTree.partners,
          children: editingTree.children,
          birthYear: parseInt(editingTree.birthYear, 10),
          deathYear: parseInt(editingTree.deathYear, 10),
        }
      );

      // Jeśli odpowiedź jest pozytywna, dodajemy drzewo do lokalnego stanu
      if (response.status === 200) {
        setFounderAdded(false);
        setFamilyTrees([...familyTrees, response.data]); // Zakładając, że odpowiedź zawiera zapisane drzewo
        alert("Drzewo genealogiczne zostało zapisane!");
      } else {
        alert("Błąd podczas zapisywania drzewa genealogicznego.");
      }

      // Resetujemy stan edytowanego drzewa po zapisaniu
      setEditingTree(null);
      setIfSaveFamily(!ifSaveFamily);
    } catch (error) {
      console.error("Błąd zapisywania drzewa:", error);
      alert("Wystąpił błąd podczas zapisywania drzewa. Spróbuj ponownie.");
    }
  };

  const handleUpdateFamilyTree = async () => {
    console.log("Aktualizowanie drzewa genealogicznego:", editingTree);
    if (!editingTree.name || !editingTree.surname) {
      alert("Podaj imię i nazwisko założyciela drzewa!");
      return;
    }

    try {
      // Wykonanie żądania POST do API, aby zapisać drzewo genealogiczne
      const response = await axios.post(
        "http://localhost:8080/api/persons/edit-family-tree",
        {
          id: editingTree.id,
          treeName: editingTree.treeName,
          name: editingTree.name,
          surname: editingTree.surname,
          partners: editingTree.partners,
          children: editingTree.children,
          birthYear: parseInt(editingTree.birthYear, 10),
          deathYear: parseInt(editingTree.deathYear, 10),
        }
      );

      // Jeśli odpowiedź jest pozytywna, dodajemy drzewo do lokalnego stanu
      if (response.status === 200) {
        setFounderAdded(false);
        setUpdating(false);
        setFamilyTrees([...familyTrees, response.data]); // Zakładając, że odpowiedź zawiera zapisane drzewo
        alert("Drzewo genealogiczne zaktualizowane!");
      } else {
        alert("Błąd podczas aktualizacji drzewa genealogicznego.");
      }

      // Resetujemy stan edytowanego drzewa po zapisaniu
      setEditingTree(null);
      setIfSaveFamily(!ifSaveFamily);
    } catch (error) {
      console.error("Błąd zapisywania drzewa:", error);
      alert("Wystąpił błąd podczas zapisywania drzewa. Spróbuj ponownie.");
    }
  };

  const getAllTrees = async () => {
    setFounderAdded(false);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/persons/root-persons"
      );
      console.log("Poprawnie pobrano drzewa genealogiczne:", response.data);
      setFamilyTrees(response.data);
    } catch (error) {
      console.error("Błąd pobierania drzewa genealogicznego:", error);
    }
  };

  const handleEditTree = (tree) => {
    console.log("Edytowanie drzewa:", tree);
    setEditingTree(tree);
    setFounderAdded(true);
    setUpdating(true);
  };

  useEffect(() => {
    getAllTrees();
    setSelectedTree(familyTrees[0]);
  }, [ifSaveFamily]);

  useEffect(() => {
    if(familyTrees.length > 2)
    setSelectedTree(familyTrees[2]);
  }, [familyTrees]);

  const renderFamilyTree = (person, level = 0) => {
    const uniqueKey = `${person.name}-${person.surname}-${level}`;

    return (
      <Box
        key={uniqueKey} // Unikalny klucz węzła
        marginLeft={`${level * 30}px`} // Wcięcie w zależności od poziomu
        padding="10px"
        borderLeft="2px solid #ccc"
      >
        <Typography variant="body1">
          {
            <>
              {person ? (
                <>
                  <b>
                    {person.name} {person.surname}
                  </b>{" "}
                  ({person.birthYear > 0 ? person.birthYear : ""}-
                  {person.deathYear > 0 ? person.deathYear : "now"})
                </>
              ) : null}
            </>
          }
          {person.partners ? (
            <>
              {" and "}
              <b>
                {person.partners.name} {person.partners.surname}
              </b>{" "}
              ({person.partners.birthYear > 0 ? person.partners.birthYear : ""}-
              {person.partners.deathYear > 0
                ? person.partners.deathYear
                : "now"}
              )
            </>
          ) : (
            ""
          )}
        </Typography>

        {/* Przyciski edycji widoczne tylko dla nowo tworzonych drzew */}
        {editingTree && (
          <>
            {expandedNode === uniqueKey ? ( // Rozwijamy tylko węzeł z unikalnym kluczem
              <Box marginTop="10px">
                <TextField
                  size="small"
                  sx={{ width: 130 }}
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  size="small"
                  sx={{ width: 130 }}
                  label="Surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  size="small"
                  sx={{ width: 65 }}
                  label="Birth year"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  size="small"
                  sx={{ width: 65 }}
                  label="Death year"
                  value={deathYear}
                  onChange={(e) => setDeathYear(e.target.value)}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddPartner(person)}
                  style={{ marginRight: "10px" }}
                >
                  Add as a Partner
                </Button>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddChild(person)}
                >
                  Add as a Child
                </Button>
              </Box>
            ) : (
              <Button
                startIcon={<AddIcon />}
                variant="text"
                color="primary"
                onClick={() => handleExpandNode(uniqueKey)} // Użycie unikalnego klucza
                style={{ marginTop: "10px" }}
              >
                New member
              </Button>
            )}
          </>
        )}

        {/* Rekurencyjne renderowanie dzieci */}
        {person.children.length > 0 && (
          <Box marginLeft="10px">
            {person.children.map(
              (child) => renderFamilyTree(child, level + 1) // Wywołanie dla każdego dziecka
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <div className="MainPage" style={{ display: "flex" }}>
      {/* Drawer na stałe otwarty */}
      <Drawer
        variant="permanent"
        anchor="left"
        style={{ zIndex: 1 }}
        PaperProps={{ style: { width: 220, padding: "10px" } }}
      >
        <div style={{ padding: "10px" }}>
          {/* Pełny przycisk "+ Add Family Tree" */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            style={{ marginBottom: "10px", width: "100%" }}
            onClick={() => {
              setSelectedTree(null);
              handleAddFamilyTree();
            }}
          >
            Add Family Tree
          </Button>

          {/* Lista drzew genealogicznych */}
          <List>
            {familyTrees.map((tree) => (
              <ListItem
                button="true"
                key={tree.id}
                onClick={() => handleTreeSelect(tree)}
              >
                <ListItemText primary={tree.treeName} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      <div style={{ flex: 1, marginLeft: "250px", padding: "20px" }}>
        {/* Wyświetlanie drzewa genealogicznego */}
        {selectedTree && !editingTree && (
          <div>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              {selectedTree.treeName}
              <EditIcon
                onClick={() => handleEditTree(selectedTree)}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                  color: "#1976d2", // Kolor ikony
                }}
              />
            </h2>
            {renderFamilyTree(selectedTree)}
          </div>
        )}

        {/* Edycja nowego drzewa genealogicznego */}
        {editingTree && (
          <div>
            <Box marginBottom="20px">
              <TextField
                size="small"
                sx={{ width: 190 }}
                label="Tree Name"
                value={editingTree.treeName}
                onChange={(e) =>
                  setEditingTree({
                    ...editingTree,
                    treeName: e.target.value,
                  })
                }
                style={{ marginRight: "10px" }}
              />

              <h2>{editingTree.treeName}</h2>

              {!founderAdded ? (
                <div>
                  <TextField
                    size="small"
                    sx={{ width: 130 }}
                    label="Founder name"
                    value={editingTree.name}
                    onChange={(e) =>
                      setEditingTree({
                        ...editingTree,
                        name: e.target.value,
                      })
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <TextField
                    size="small"
                    sx={{ width: 130 }}
                    label="Founder surname"
                    value={editingTree.surname}
                    onChange={(e) =>
                      setEditingTree({
                        ...editingTree,
                        surname: e.target.value,
                      })
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <TextField
                    size="small"
                    sx={{ width: 65 }}
                    label="Birth year"
                    value={editingTree.birthYear}
                    onChange={(e) =>
                      setEditingTree({
                        ...editingTree,
                        birthYear: e.target.value,
                      })
                    }
                    style={{ marginRight: "10px" }}
                  />
                  <TextField
                    size="small"
                    sx={{ width: 65 }}
                    label="Death year"
                    value={editingTree.deathYear}
                    onChange={(e) =>
                      setEditingTree({
                        ...editingTree,
                        deathYear: e.target.value,
                      })
                    }
                    style={{ marginRight: "10px" }}
                  />

                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => setFounderAdded(true)}
                  >
                    Add Founder
                  </Button>
                </div>
              ) : (
                renderFamilyTree(editingTree, 0)
              )}
            </Box>

            {/* Zapis drzewa */}
            <Button
              variant="contained"
              color="secondary"
              onClick={updating ? handleUpdateFamilyTree : handleSaveFamilyTree}
              style={{ marginTop: "20px" }}
            >
              {updating ? "Update Family Tree" : "Save Family Tree"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;

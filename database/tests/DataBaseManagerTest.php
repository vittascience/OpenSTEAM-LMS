<?php

namespace Database;

use PHPUnit\Framework\TestCase;

class DataBaseManagerTest extends TestCase
{

    private function createTemporaryTestTable()
    {
        DataBaseManager::getSharedInstance()->exec("CREATE TEMPORARY TABLE IF NOT EXISTS Test  (
            TestID int,
            TestName varchar(255));");
    }

    /**
     * This method is called before each test.
     */
    public function setUp(): void
    {
        $this->createTemporaryTestTable();
    }

    public function testGetSharedInstance()
    {
        $this->assertIsObject(DataBaseManager::getSharedInstance());
        $this->assertInstanceOf(DataBaseManager::class, DataBaseManager::getSharedInstance());
        $instance = DataBaseManager::getSharedInstance();
        // Asserting same reference
        $this->assertThat($instance, $this->equalTo(DataBaseManager::getSharedInstance()));
    }

    public function testGetAll()
    {
        DataBaseManager::getSharedInstance()->beginTransaction();
        for ($i = 0; $i < 2; $i++) {
            DataBaseManager::getSharedInstance()->exec(
                "INSERT INTO Test (TestID,TestName) VALUES(?,?)",
                array(1, "test")
            );
        }
        $actual = DataBaseManager::getSharedInstance()->getAll("SELECT * FROM Test");
        $this->assertIsArray($actual, "Failed result of getAll needs to be an array"); // Needs to be array
        $this->assertIsIterable($actual, "Failed result of getAll needs to be iterable"); // Needs to be iterable i.e. can loop through
        $this->assertCount(2, $actual);
        $this->assertArrayHasKey("TestID", $actual[0], "Failed array result of getAll should contain TestID");
        // Rollback
        DataBaseManager::getSharedInstance()->rollBack();
    }

    public function testGet()
    {
        DataBaseManager::getSharedInstance()->beginTransaction();
        DataBaseManager::getSharedInstance()->exec(
            "INSERT INTO Test (TestID,TestName) VALUES(?,?)",
            array(1, "test")
        );
        $actual = DataBaseManager::getSharedInstance()->get("SELECT * FROM Test WHERE TestName=?", array("test"));
        $this->assertIsArray($actual, "Failed result of get needs to be an array"); // Needs to be array
        $this->assertIsIterable($actual, "Failed result of get needs to be iterable");
        $this->assertArrayHasKey("TestID", $actual, "Failed array result of get should contain TestID");
        // Associative array with two keys
        $this->assertCount(2, $actual);
        $this->assertEquals("test", $actual["TestName"]);
        // Rollback
        DataBaseManager::getSharedInstance()->rollBack();
    }

    public function testInsertEntries()
    {
        DataBaseManager::getSharedInstance()->beginTransaction();

        // Insert 10 entries.
        $entriesCount = 10;
        for ($i = 1; $i <= $entriesCount; $i++) {
            DataBaseManager::getSharedInstance()->exec("INSERT INTO Test (TestID,TestName) 
            VALUES(?,?)", array($i, "test"));
        }
        $actual = DataBaseManager::getSharedInstance()->getAll("SELECT * FROM Test");
        $expected = 10;
        $this->assertCount($expected, $actual);
        // Insert one more and test.
        DataBaseManager::getSharedInstance()->exec("INSERT INTO Test (TestID,TestName) 
        VALUES(?,?)", array(100, "test100"));
        $actual = DataBaseManager::getSharedInstance()->getAll("SELECT * FROM Test");
        $expected++;
        $this->assertCount($expected, $actual);

        // Rollback
        DataBaseManager::getSharedInstance()->rollBack();
    }


    public function testDeleteEntries()
    {
        DataBaseManager::getSharedInstance()->beginTransaction();
        // Insert 5 entries
        $entriesCount = 5;
        for ($i = 1; $i <= $entriesCount; $i++) {
            DataBaseManager::getSharedInstance()->exec("INSERT INTO Test (TestID,TestName) VALUES(?,?)", array($i, "test"));
        }
        // Delete first entry 
        DataBaseManager::getSharedInstance()->exec(
            "DELETE FROM Test WHERE TestID=?",
            array(1)
        );
        $actual = DataBaseManager::getSharedInstance()->getAll("SELECT * FROM Test");
        $expected = 4;
        $this->assertCount($expected, $actual);

        // Delete all entries
        DataBaseManager::getSharedInstance()->exec("DELETE FROM Test WHERE 1");
        $actual = DataBaseManager::getSharedInstance()->getAll("SELECT * FROM Test");
        $expected = 0;
        $this->assertCount($expected, $actual);

        // Rollback
        DataBaseManager::getSharedInstance()->rollBack();
    }
}
